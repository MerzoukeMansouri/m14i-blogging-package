/**
 * AI Content Generator Service
 * Handles AI-powered blog content generation using Claude API
 * Now with TOON-optimized prompts (70-80% token reduction)
 */

import Anthropic from "@anthropic-ai/sdk";
import type { LayoutSection, LayoutType } from "../../types/layouts";
import type { ContentBlock, TextBlock } from "../../types/blocks";
import type {
  GenerateCompleteBlogRequest,
  GenerateCompleteBlogResponse,
  GenerateLayoutRequest,
  GenerateLayoutResponse,
  GenerateSectionRequest,
  GenerateSectionResponse,
  GenerateSEORequest,
  GenerateSEOResponse,
  ImproveContentRequest,
  ImproveContentResponse,
  AIGenerationConfig,
  BrandContext,
  GenerateFromTemplateRequest,
} from "../../types/aiGeneration";
import {
  generateLayoutPrompt,
  generateSectionPrompt,
  generateCompletePrompt,
  generateSEOPrompt,
  generateImprovePrompt,
} from "./ai-prompts-compact";
import { getTemplate } from "../../config/layoutTemplates";
import { mergeBrandContext } from "../../config/defaults";

function getExpectedColumnCount(layoutType: LayoutType): number {
  switch (layoutType) {
    case "1-column":
      return 1;
    case "2-columns":
    case "2-columns-wide-left":
    case "2-columns-wide-right":
      return 2;
    case "grid-2x2":
    case "grid-4-even":
      return 4;
    case "grid-2x3":
      return 6;
    case "grid-3x3":
      return 9;
    default:
      return 1;
  }
}

function normalizeMarkdownContent(content: string): string {
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/^```(?:markdown|md)?\s*/i, "")
    .replace(/```$/i, "")
    // Fix AI line-wrapping mid-word inside headings:
    // e.g. "## Title Tex\n\nt\n\n" → "## Title Text\n\n"
    .replace(/^(#{1,6} .+\S)\n\n([a-z0-9]\S*)\n\n/gm, (_, heading, fragment) => `${heading}${fragment}\n\n`)
    // Normalize multiple blank lines
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isMeaningfulText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeBlock(block: ContentBlock, fallbackId: string): ContentBlock | null {
  const id = isMeaningfulText(block.id) ? block.id : fallbackId;

  switch (block.type) {
    case "text": {
      const content = normalizeMarkdownContent(block.content);
      if (!content) return null;
      return { ...block, id, content };
    }
    case "image": {
      if (!isMeaningfulText(block.src) || !isMeaningfulText(block.alt)) return null;
      return {
        ...block,
        id,
        src: block.src.trim(),
        alt: block.alt.trim(),
        caption: isMeaningfulText(block.caption) ? block.caption.trim() : undefined,
      };
    }
    case "video": {
      if (!isMeaningfulText(block.url)) return null;
      return {
        ...block,
        id,
        url: block.url.trim(),
        caption: isMeaningfulText(block.caption) ? block.caption.trim() : undefined,
      };
    }
    case "quote": {
      const content = normalizeMarkdownContent(block.content);
      if (!content) return null;
      return {
        ...block,
        id,
        content,
        author: isMeaningfulText(block.author) ? block.author.trim() : undefined,
        role: isMeaningfulText(block.role) ? block.role.trim() : undefined,
      };
    }
    case "pdf": {
      if (!isMeaningfulText(block.url)) return null;
      return {
        ...block,
        id,
        url: block.url.trim(),
        title: isMeaningfulText(block.title) ? block.title.trim() : undefined,
        description: isMeaningfulText(block.description) ? block.description.trim() : undefined,
      };
    }
    case "carousel": {
      const slides = Array.isArray(block.slides)
        ? block.slides.filter((slide) => isMeaningfulText(slide?.src) && isMeaningfulText(slide?.alt)).map((slide) => ({
            ...slide,
            src: slide.src.trim(),
            alt: slide.alt.trim(),
            caption: isMeaningfulText(slide.caption) ? slide.caption.trim() : undefined,
            title: isMeaningfulText(slide.title) ? slide.title.trim() : undefined,
          }))
        : [];

      if (slides.length === 0) return null;
      return { ...block, id, slides };
    }
    case "chart": {
      if (!Array.isArray(block.data) || block.data.length === 0) return null;
      const data = block.data
        .filter((d) => isMeaningfulText(d?.label) && typeof d?.value === "number")
        .map((d) => ({
          label: d.label.trim(),
          value: d.value,
          color: isMeaningfulText(d.color) ? d.color.trim() : undefined,
        }));
      if (data.length === 0) return null;
      return {
        ...block,
        id,
        data,
        chartType: (["bar", "line", "area", "pie"] as const).includes(block.chartType) ? block.chartType : "bar",
        title: isMeaningfulText(block.title) ? block.title.trim() : undefined,
        xAxisLabel: isMeaningfulText(block.xAxisLabel) ? block.xAxisLabel.trim() : undefined,
        yAxisLabel: isMeaningfulText(block.yAxisLabel) ? block.yAxisLabel.trim() : undefined,
        caption: isMeaningfulText(block.caption) ? block.caption.trim() : undefined,
        height: typeof block.height === "number" ? block.height : 300,
      };
    }
    default:
      return null;
  }
}

function normalizeSection(section: LayoutSection, index: number): LayoutSection {
  const expectedColumns = getExpectedColumnCount(section.type);
  const sourceColumns = Array.isArray(section.columns) ? section.columns : [];

  const normalizedColumns: ContentBlock[][] = Array.from({ length: expectedColumns }, (_, columnIndex) => {
    const column = Array.isArray(sourceColumns[columnIndex]) ? sourceColumns[columnIndex] : [];
    const normalizedBlocks = column
      .map((block, blockIndex) => normalizeBlock(block, `${section.id || `section-${index + 1}`}-c${columnIndex + 1}-b${blockIndex + 1}`))
      .filter((block): block is ContentBlock => block !== null);

    if (normalizedBlocks.length > 0) {
      return normalizedBlocks;
    }

    const fillerContent = section.type === "1-column"
      ? "## Key takeaway\n\nAdd a concrete example, detail, or scene here instead of leaving the section empty."
      : `### Point ${columnIndex + 1}\n\nAdd one specific detail, example, or visual note for this column.`;

    const fallbackBlock: ContentBlock = {
      id: `${section.id || `section-${index + 1}`}-c${columnIndex + 1}-fallback`,
      type: "text",
      content: fillerContent,
    };

    return [fallbackBlock];
  });

  const sectionId = isMeaningfulText(section.id) ? section.id : `section-${index + 1}`;

  let finalColumns: ContentBlock[][] = normalizedColumns;

  if (
    ["2-columns", "2-columns-wide-left", "2-columns-wide-right"].includes(section.type) &&
    normalizedColumns.length === 2 &&
    normalizedColumns.every((column) => column.every((block) => block.type === "text"))
  ) {
    const supportingBlock: ContentBlock = {
      id: `${sectionId}-c2-supporting-quote`,
      type: "quote",
      content: "A strong supporting quote, stat, or visual callout belongs here to create contrast with the main text column.",
      author: "Editorial note",
      role: "Layout fallback",
    };
    finalColumns = [normalizedColumns[0], [supportingBlock]];
  }

  return {
    id: sectionId,
    type: section.type,
    columns: finalColumns,
  };
}

function normalizeSections(sections: LayoutSection[]): LayoutSection[] {
  return sections.map((section, index) => normalizeSection(section, index));
}

/**
 * Helper: Strip markdown code blocks and extract valid JSON from response
 * Handles various formats that Claude might use and extracts only the JSON object
 */
function stripMarkdownCodeBlocks(text: string): string {
  let cleaned = text.trim();

  // Remove ```json ... ``` or ``` ... ``` wrapping (multiline)
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/m, '');
  cleaned = cleaned.replace(/\n?```\s*$/m, '');

  // Remove any remaining backticks at start/end
  cleaned = cleaned.replace(/^`+\s*/, '');
  cleaned = cleaned.replace(/\s*`+$/, '');

  // Extract only the JSON object: find first { and last }
  // This handles cases where the model adds text after the JSON
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned.trim();
}

function extractTextContent(message: unknown): string {
  if (!message || typeof message !== "object" || !("content" in message)) {
    return "";
  }

  const content = message.content;
  if (!Array.isArray(content)) {
    return "";
  }

  const firstBlock = content[0];
  if (!firstBlock || typeof firstBlock !== "object") {
    return "";
  }

  return "type" in firstBlock && firstBlock.type === "text" && "text" in firstBlock && typeof firstBlock.text === "string"
    ? firstBlock.text
    : "";
}

function looksLikeJsonObject(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.startsWith("{") && trimmed.endsWith("}");
}

function looksLikeRefusalOrProse(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  return !looksLikeJsonObject(text) && (
    normalized.startsWith("i can't") ||
    normalized.startsWith("i cannot") ||
    normalized.startsWith("i'm sorry") ||
    normalized.startsWith("sorry") ||
    normalized.startsWith("here's") ||
    normalized.startsWith("here is")
  );
}

/**
 * AI Content Generator class
 */
export class AIContentGenerator {
  private anthropic: Anthropic;
  private config: Required<Omit<AIGenerationConfig, "apiKey">>;

  constructor(config: AIGenerationConfig) {
    this.anthropic = new Anthropic({
      apiKey: config.apiKey,
    });

    this.config = {
      model: config.model || process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022",
      maxTokens: config.maxTokens || 4000,
      temperature: config.temperature || 0.3,
    };
  }

  /**
   * Get brand context from database or defaults
   * @private
   */
  private async getBrandContext(supabaseClient?: any): Promise<BrandContext> {
    if (!supabaseClient) {
      return mergeBrandContext();
    }

    try {
      const { data } = await supabaseClient
        .from("blog_brand_settings")
        .select("*")
        .single();

      return mergeBrandContext(data || undefined);
    } catch {
      return mergeBrandContext();
    }
  }

  /**
   * Generate layout structure only (Step 1)
   * Returns title, excerpt, and section structure without content
   * Now using TOON-optimized prompts with multilingual support
   */
  async generateLayout(
    request: GenerateLayoutRequest & { supabaseClient?: any }
  ): Promise<GenerateLayoutResponse> {
    const brandContext = await this.getBrandContext(request.supabaseClient);

    const systemPrompt = generateLayoutPrompt({
      length: request.length,
      layoutPreference: request.layoutPreference,
      tone: request.tone,
      additionalInstructions: request.additionalInstructions,
      language: request.language || "en",
      brandContext,
    });

    const lang = request.language || "en";
    const userPrompt = lang === "fr"
      ? `Générer la structure du blog pour : ${request.prompt}`
      : `Generate blog post layout for: ${request.prompt}`;

    const createLayoutMessage = async (
      messages: Array<{ role: "user" | "assistant"; content: string }>,
      temperature = this.config.temperature
    ) => {
      return this.anthropic.messages.create({
        model: this.config.model,
        max_tokens: 1000,
        temperature,
        system: [
          {
            type: "text",
            text: systemPrompt,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages,
      });
    };

    const normalizeLayoutResponse = (parsed: GenerateLayoutResponse): GenerateLayoutResponse => ({
      ...parsed,
      layout: Array.isArray(parsed.layout)
        ? parsed.layout.map((section, index) => ({
            ...section,
            id: isMeaningfulText(section.id) ? section.id : `section-${index + 1}`,
            description: isMeaningfulText(section.description)
              ? section.description.trim()
              : `Section ${index + 1}`,
          }))
        : [],
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.filter(isMeaningfulText).map((tag) => tag.trim()).slice(0, 5)
        : [],
    });

    const initialMessage = await createLayoutMessage([
      {
        role: "user",
        content: userPrompt,
      },
    ]);

    let responseText = extractTextContent(initialMessage);
    let cleanedText = stripMarkdownCodeBlocks(responseText);

    try {
      return normalizeLayoutResponse(JSON.parse(cleanedText) as GenerateLayoutResponse);
    } catch (error) {
      console.error("JSON Parse Error (Layout):", error);
      console.error("Raw layout response (first 500 chars):", responseText.substring(0, 500));
      console.error("Cleaned layout response (first 500 chars):", cleanedText.substring(0, 500));

      const correctionPrompt = lang === "fr"
        ? "Ta réponse précédente n'était pas un JSON valide. Corrige-la et renvoie uniquement un objet JSON valide correspondant à {title,slug,excerpt,layout,category?,tags}. N'ajoute aucun commentaire. Répare les guillemets, virgules, échappements et retours de ligne."
        : "Your previous response was not valid JSON. Fix it and return only a valid JSON object matching {title,slug,excerpt,layout,category?,tags}. Do not add commentary. Repair quotes, commas, escapes, and line breaks.";

      const correctedMessage = await createLayoutMessage(
        [
          {
            role: "user",
            content: userPrompt,
          },
          {
            role: "assistant",
            content: responseText,
          },
          {
            role: "user",
            content: correctionPrompt,
          },
        ],
        0.1
      );

      responseText = extractTextContent(correctedMessage);
      cleanedText = stripMarkdownCodeBlocks(responseText);

      try {
        return normalizeLayoutResponse(JSON.parse(cleanedText) as GenerateLayoutResponse);
      } catch (retryError) {
        console.error("JSON Parse Error (Layout Retry):", retryError);
        console.error("Retry layout response (first 500 chars):", responseText.substring(0, 500));

        if (looksLikeRefusalOrProse(responseText)) {
          throw new Error("Failed to parse layout response: Anthropic returned prose or a refusal instead of JSON. Use structured outputs for guaranteed schema-valid responses.");
        }

        throw new Error(`Failed to parse layout response: ${retryError instanceof Error ? retryError.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * Generate a complete blog post from a prompt
   * Now with multilingual support
   */
  async generateCompleteBlogPost(
    request: GenerateCompleteBlogRequest & { supabaseClient?: any }
  ): Promise<GenerateCompleteBlogResponse> {
    const brandContext = await this.getBrandContext(request.supabaseClient);
    const systemPrompt = this.buildCompleteBlogPrompt(request, brandContext);
    const lang = request.language || "en";
    const userPrompt = lang === "fr"
      ? `Générer un article de blog complet sur : ${request.prompt}`
      : `Generate a complete blog post about: ${request.prompt}`;

    const message = await this.anthropic.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" }, // Cache system prompt for faster subsequent calls
        },
      ],
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the JSON response (strip markdown code blocks first)
    const cleanedText = stripMarkdownCodeBlocks(responseText);

    // Try to parse JSON with detailed error reporting
    let result: GenerateCompleteBlogResponse;
    try {
      result = JSON.parse(cleanedText) as GenerateCompleteBlogResponse;
    } catch (error) {
      // Log the problematic JSON for debugging
      console.error("JSON Parse Error:", error);
      console.error("Problematic JSON (first 500 chars):", cleanedText.substring(0, 500));
      console.error("Problematic JSON (last 500 chars):", cleanedText.substring(Math.max(0, cleanedText.length - 500)));

      // Try to provide more context about where the error occurred
      if (error instanceof SyntaxError) {
        const match = error.message.match(/position (\d+)/);
        if (match) {
          const position = parseInt(match[1]);
          const context = cleanedText.substring(Math.max(0, position - 100), Math.min(cleanedText.length, position + 100));
          console.error(`Context around error position ${position}:`, context);
        }
      }

      throw new Error(`Failed to parse AI response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}. This usually means the AI didn't follow the JSON format instructions. Please try again.`);
    }

    return {
      ...result,
      sections: normalizeSections(result.sections || []),
      tags: Array.isArray(result.tags)
        ? result.tags.filter(isMeaningfulText).map((tag) => tag.trim()).slice(0, 8)
        : [],
      excerpt: isMeaningfulText(result.excerpt) ? result.excerpt.trim() : "",
      title: isMeaningfulText(result.title) ? result.title.trim() : "Untitled",
      slug: isMeaningfulText(result.slug) ? result.slug.trim() : "untitled",
    };
  }

  /**
   * Generate a complete blog post with streaming (faster perceived performance)
   * Returns an async generator that yields text chunks
   * Now with multilingual support
   */
  async *generateCompleteBlogPostStream(
    request: GenerateCompleteBlogRequest & { supabaseClient?: any }
  ): AsyncGenerator<string, void, undefined> {
    const brandContext = await this.getBrandContext(request.supabaseClient);
    const systemPrompt = this.buildCompleteBlogPrompt(request, brandContext);
    const lang = request.language || "en";
    const userPrompt = lang === "fr"
      ? `Générer un article de blog complet sur : ${request.prompt}`
      : `Generate a complete blog post about: ${request.prompt}`;

    const stream = await this.anthropic.messages.stream({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" }, // Cache system prompt for faster streaming
        },
      ],
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        yield chunk.delta.text;
      }
    }
  }

  /**
   * Build the comprehensive prompt for blog post generation
   * Extracted for reuse between streaming and non-streaming methods
   * Now using TOON-optimized prompts with multilingual support
   */
  private buildCompleteBlogPrompt(request: GenerateCompleteBlogRequest, brandContext: BrandContext): string {
    return generateCompletePrompt({
      tone: request.tone,
      length: request.length,
      layoutPreference: request.layoutPreference,
      additionalInstructions: request.additionalInstructions,
      language: request.language || "en",
      brandContext,
    });
  }

  /**
   * Generate a single section with specific layout
   * Now using TOON-optimized prompts with multilingual support
   */
  async generateSection(
    request: GenerateSectionRequest & { supabaseClient?: any; brandContext?: BrandContext }
  ): Promise<GenerateSectionResponse> {
    const brandContext = request.brandContext || await this.getBrandContext(request.supabaseClient);

    const systemPrompt = generateSectionPrompt(
      request.layoutType,
      request.context,
      request.language || "en",
      brandContext
    );

    const lang = request.language || "en";
    const userPrompt = lang === "fr"
      ? `Générer une section sur : ${request.prompt}`
      : `Generate a section about: ${request.prompt}`;

    const createSectionMessage = async (
      messages: Array<{ role: "user" | "assistant"; content: string }>,
      temperature = this.config.temperature
    ) => {
      return this.anthropic.messages.create({
        model: this.config.model,
        max_tokens: 2000,
        temperature,
        system: systemPrompt,
        messages,
      });
    };

    const initialMessage = await createSectionMessage([
      {
        role: "user",
        content: userPrompt,
      },
    ]);

    let responseText = extractTextContent(initialMessage);
    let cleanedText = stripMarkdownCodeBlocks(responseText);

    let result: GenerateSectionResponse;
    try {
      result = JSON.parse(cleanedText) as GenerateSectionResponse;
    } catch (error) {
      console.error("JSON Parse Error (Section):", error);
      console.error("Raw response (first 500 chars):", responseText.substring(0, 500));
      console.error("Cleaned JSON (first 500 chars):", cleanedText.substring(0, 500));
      console.error("Cleaned JSON (last 500 chars):", cleanedText.substring(Math.max(0, cleanedText.length - 500)));

      if (error instanceof SyntaxError) {
        const match = error.message.match(/position (\d+)/);
        if (match) {
          const position = parseInt(match[1]);
          const context = cleanedText.substring(Math.max(0, position - 100), Math.min(cleanedText.length, position + 100));
          console.error(`Context around error position ${position}:`, context);
        }
      }

      const correctionPrompt = lang === "fr"
        ? "Ta réponse précédente n'était pas un JSON valide. Corrige-la et renvoie uniquement un objet JSON valide pour {section:{id,type,columns}}. Ne change pas le sens du contenu. N'ajoute aucun commentaire. Répare les guillemets, virgules, échappements et retours de ligne."
        : "Your previous response was not valid JSON. Fix it and return only a valid JSON object for {section:{id,type,columns}}. Do not change the meaning of the content. Do not add commentary. Repair quotes, commas, escapes, and line breaks.";

      const correctedMessage = await createSectionMessage(
        [
          {
            role: "user",
            content: userPrompt,
          },
          {
            role: "assistant",
            content: responseText,
          },
          {
            role: "user",
            content: correctionPrompt,
          },
        ],
        0.1
      );

      responseText = extractTextContent(correctedMessage);
      cleanedText = stripMarkdownCodeBlocks(responseText);

      try {
        result = JSON.parse(cleanedText) as GenerateSectionResponse;
      } catch (retryError) {
        console.error("JSON Parse Error (Section Retry):", retryError);
        console.error("Retry response (first 500 chars):", responseText.substring(0, 500));
        throw new Error(`Failed to parse section response as JSON: ${retryError instanceof Error ? retryError.message : 'Unknown error'}. Check server logs for details.`);
      }
    }

    return {
      ...result,
      section: normalizeSection(result.section, 0),
    };
  }

  /**
   * Generate complete blog post from template
   * Faster and more reliable than custom AI layout generation
   */
  async generateFromTemplate(
    request: GenerateFromTemplateRequest & { supabaseClient?: any }
  ): Promise<GenerateCompleteBlogResponse> {
    const template = getTemplate(request.templateId);
    if (!template) {
      throw new Error(`Template not found: ${request.templateId}`);
    }

    const brandContext = await this.getBrandContext(request.supabaseClient);
    const lang = request.language || "en";

    // Generate title, excerpt, slug
    const titlePrompt = generateLayoutPrompt({
      length: template.suggestedLength,
      tone: request.tone || brandContext.tone,
      language: lang,
      brandContext,
    });

    const titleUserPrompt = lang === "fr"
      ? `Générer titre et extrait pour : ${request.prompt}`
      : `Generate title and excerpt for: ${request.prompt}`;

    const titleMessage = await this.anthropic.messages.create({
      model: this.config.model,
      max_tokens: 500,
      temperature: this.config.temperature,
      system: titlePrompt,
      messages: [{ role: "user", content: titleUserPrompt }],
    });

    const titleText = extractTextContent(titleMessage);
    const titleCleaned = stripMarkdownCodeBlocks(titleText);
    let titleData: { title: string; slug: string; excerpt: string; category?: string };
    try {
      titleData = JSON.parse(titleCleaned);
    } catch {
      titleData = {
        title: request.prompt,
        slug: request.prompt.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt: request.prompt,
      };
    }

    // Generate all sections in parallel using template structure
    const sectionPromises = template.sections.map(async (templateSection, index) => {
      const sectionRequest: GenerateSectionRequest & { brandContext?: BrandContext } = {
        prompt: `${request.prompt}. ${templateSection.contentGuidance}`,
        layoutType: templateSection.layoutType,
        language: lang,
        context: `Purpose: ${templateSection.purpose}`,
        brandContext,
      };

      const result = await this.generateSection(sectionRequest);
      return {
        ...result.section,
        id: result.section.id || `section-${index + 1}`,
      };
    });

    const sections = await Promise.all(sectionPromises);

    return {
      title: titleData.title,
      slug: titleData.slug,
      excerpt: titleData.excerpt,
      sections: normalizeSections(sections),
      seo_metadata: {
        description: titleData.excerpt.substring(0, 160),
        keywords: [],
        robots: "index, follow",
      },
      category: titleData.category,
      tags: [],
    };
  }

  /**
   * Generate SEO metadata for a blog post
   * Now using TOON-optimized prompts
   */
  async generateSEO(request: GenerateSEORequest & { language?: "en" | "fr" }): Promise<GenerateSEOResponse> {
    const lang = request.language || "en";
    const systemPrompt = generateSEOPrompt(lang);

    const userPrompt = lang === "fr"
      ? `Générer métadonnées SEO pour article :
Titre: ${request.title}
${request.excerpt ? `Extrait: ${request.excerpt}` : ""}
${request.category ? `Catégorie: ${request.category}` : ""}
${request.tags ? `Tags existants: ${request.tags.join(", ")}` : ""}`
      : `Generate SEO metadata for a blog post:
Title: ${request.title}
${request.excerpt ? `Excerpt: ${request.excerpt}` : ""}
${request.category ? `Category: ${request.category}` : ""}
${request.tags ? `Existing tags: ${request.tags.join(", ")}` : ""}`;

    const message = await this.anthropic.messages.create({
      model: this.config.model,
      max_tokens: 1000,
      temperature: 0.5, // Lower temperature for more focused SEO content
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the JSON response (strip markdown code blocks first)
    const cleanedText = stripMarkdownCodeBlocks(responseText);

    // Try to parse JSON with detailed error reporting
    let result: GenerateSEOResponse;
    try {
      result = JSON.parse(cleanedText) as GenerateSEOResponse;
    } catch (error) {
      console.error("JSON Parse Error (SEO):", error);
      console.error("Raw response:", responseText.substring(0, 500));
      console.error("Cleaned JSON:", cleanedText);
      throw new Error(`Failed to parse SEO response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Improve existing content based on instruction
   * Now using TOON-optimized prompts with multilingual support
   */
  async improveContent(
    request: ImproveContentRequest & { language?: "en" | "fr" }
  ): Promise<ImproveContentResponse> {
    const lang = request.language || "en";
    const systemPrompt = generateImprovePrompt(
      request.instruction,
      request.additionalContext,
      lang
    );

    const userPrompt = lang === "fr"
      ? `Contenu original:\n\n${request.content}`
      : `Original content:\n\n${request.content}`;

    const message = await this.anthropic.messages.create({
      model: this.config.model,
      max_tokens: 2000,
      temperature: this.config.temperature,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the JSON response (strip markdown code blocks first)
    const cleanedText = stripMarkdownCodeBlocks(responseText);
    const result = JSON.parse(cleanedText) as ImproveContentResponse;

    return result;
  }

  /**
   * Helper: Get column requirements for a layout type
   */
  private getLayoutColumnRequirements(layoutType: LayoutType): string {
    const requirements: Record<LayoutType, string> = {
      "1-column": "1 column - full width content",
      "2-columns": "2 columns - equal width",
      "2-columns-wide-left": "2 columns - left column wider (66% / 33%)",
      "2-columns-wide-right": "2 columns - right column wider (33% / 66%)",
      "grid-2x2": "4 columns - 2x2 grid layout",
      "grid-3x3": "9 columns - 3x3 grid layout",
      "grid-2x3": "6 columns - 2x3 grid layout",
      "grid-4-even": "4 columns - even grid",
    };

    return requirements[layoutType];
  }
}

/**
 * Create an instance of AIContentGenerator
 * Throws error if ANTHROPIC_API_KEY is not set
 */
export function createAIContentGenerator(
  config?: Partial<AIGenerationConfig>
): AIContentGenerator {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY environment variable is not set. Please add it to your .env file."
    );
  }

  return new AIContentGenerator({
    apiKey,
    ...config,
  });
}
