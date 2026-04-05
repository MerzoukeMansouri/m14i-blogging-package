/**
 * AI Content Generator Service
 * Handles AI-powered blog content generation using Claude API
 */

import Anthropic from "@anthropic-ai/sdk";
import type { LayoutSection, LayoutType } from "../../types/layouts";
import type { ContentBlock, TextBlock, QuoteBlock } from "../../types/blocks";
import type {
  GenerateCompleteBlogRequest,
  GenerateCompleteBlogResponse,
  GenerateSectionRequest,
  GenerateSectionResponse,
  GenerateSEORequest,
  GenerateSEOResponse,
  ImproveContentRequest,
  ImproveContentResponse,
  AIGenerationConfig,
} from "../../types/aiGeneration";

/**
 * Helper: Strip markdown code blocks from JSON response
 */
function stripMarkdownCodeBlocks(text: string): string {
  // Remove ```json ... ``` or ``` ... ``` wrapping
  const codeBlockPattern = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/;
  const match = text.trim().match(codeBlockPattern);
  return match ? match[1].trim() : text.trim();
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
      model: config.model || "claude-3-5-sonnet-20241022",
      maxTokens: config.maxTokens || 4000,
      temperature: config.temperature || 0.7,
    };
  }

  /**
   * Generate a complete blog post from a prompt
   */
  async generateCompleteBlogPost(
    request: GenerateCompleteBlogRequest
  ): Promise<GenerateCompleteBlogResponse> {
    const systemPrompt = `You are an expert blog content writer. Your task is to generate high-quality, engaging blog posts based on user prompts.

IMPORTANT: You must respond ONLY with valid JSON. Do not include any markdown formatting, explanations, or text outside the JSON structure.

Generate a complete blog post with the following structure:
- title: A compelling, SEO-friendly title
- slug: URL-friendly version of the title (lowercase, hyphens)
- excerpt: A concise 150-160 character summary
- sections: Array of content sections with layouts
- seo_metadata: SEO metadata including description, keywords, Open Graph, and Twitter Card data
- category: Suggested category
- tags: Array of relevant tags (3-5 tags)

Each section should have:
- id: unique identifier (use format: section-1, section-2, etc.)
- type: one of the layout types (1-column, 2-columns, 3-columns, 2-columns-wide-left, 2-columns-wide-right, grid-2x2, grid-3x3, grid-2x3, grid-4-even)
- columns: array of content blocks organized by column

Content blocks can be:
- text: { id: string, type: "text", content: string (markdown supported) }
- quote: { id: string, type: "quote", content: string, author?: string, role?: string }

Use varied layouts to make the content visually interesting. Start with a 1-column layout for the introduction, then use 2-column or 3-column layouts for main content.

${request.tone ? `Tone: ${request.tone}` : "Tone: Professional and engaging"}
${request.length ? `Length: ${request.length}` : "Length: medium (3-5 sections)"}
${request.additionalInstructions ? `Additional instructions: ${request.additionalInstructions}` : ""}`;

    const userPrompt = `Generate a complete blog post about: ${request.prompt}`;

    const message = await this.anthropic.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
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
    const result = JSON.parse(cleanedText) as GenerateCompleteBlogResponse;

    return result;
  }

  /**
   * Generate a single section with specific layout
   */
  async generateSection(
    request: GenerateSectionRequest
  ): Promise<GenerateSectionResponse> {
    const systemPrompt = `You are an expert content writer. Generate a single blog section with the specified layout.

IMPORTANT: You must respond ONLY with valid JSON. Do not include any markdown formatting, explanations, or text outside the JSON structure.

The section must have this structure:
{
  "section": {
    "id": "unique-id",
    "type": "${request.layoutType}",
    "columns": [...]
  }
}

Layout "${request.layoutType}" requires:
${this.getLayoutColumnRequirements(request.layoutType)}

Each column is an array of content blocks. Content blocks can be:
- text: { id: string, type: "text", content: string (markdown supported) }
- quote: { id: string, type: "quote", content: string, author?: string, role?: string }

Generate compelling, well-structured content that flows naturally.

${request.context ? `Context from the rest of the post: ${request.context}` : ""}`;

    const userPrompt = `Generate a section about: ${request.prompt}`;

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
    const result = JSON.parse(cleanedText) as GenerateSectionResponse;

    return result;
  }

  /**
   * Generate SEO metadata for a blog post
   */
  async generateSEO(request: GenerateSEORequest): Promise<GenerateSEOResponse> {
    const systemPrompt = `You are an SEO expert. Generate comprehensive SEO metadata for a blog post.

IMPORTANT: You must respond ONLY with valid JSON. Do not include any markdown formatting, explanations, or text outside the JSON structure.

Generate SEO metadata with this structure:
{
  "seo_metadata": {
    "description": "SEO-optimized meta description (150-160 characters)",
    "keywords": ["keyword1", "keyword2", ...],
    "robots": "index, follow",
    "openGraph": {
      "title": "Engaging Open Graph title",
      "description": "Compelling OG description"
    },
    "twitter": {
      "card": "summary_large_image",
      "title": "Twitter-optimized title",
      "description": "Twitter-optimized description"
    }
  },
  "tags": ["tag1", "tag2", "tag3"]
}

Focus on:
- Clear, compelling descriptions that encourage clicks
- Relevant keywords that match search intent
- Optimized titles for social sharing
- 3-5 highly relevant tags`;

    const userPrompt = `Generate SEO metadata for a blog post:
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
    const result = JSON.parse(cleanedText) as GenerateSEOResponse;

    return result;
  }

  /**
   * Improve existing content based on instruction
   */
  async improveContent(
    request: ImproveContentRequest
  ): Promise<ImproveContentResponse> {
    const instructions = {
      expand:
        "Expand this content with more details, examples, and explanations. Make it more comprehensive and informative.",
      shorten:
        "Make this content more concise while preserving all key points. Remove redundancy and focus on clarity.",
      rewrite:
        "Rewrite this content to make it more engaging and better structured while maintaining the same meaning.",
      "add-examples":
        "Add relevant, practical examples to illustrate the concepts in this content.",
      "improve-clarity":
        "Improve the clarity and readability of this content. Make complex ideas easier to understand.",
      "make-engaging":
        "Make this content more engaging and compelling. Add hooks, improve flow, and make it more interesting to read.",
    };

    const systemPrompt = `You are an expert content editor. Your task is to improve the given content based on the instruction.

IMPORTANT: You must respond ONLY with valid JSON. Do not include any markdown formatting, explanations, or text outside the JSON structure.

Instruction: ${instructions[request.instruction]}

${request.additionalContext ? `Additional context: ${request.additionalContext}` : ""}

Return the result in this format:
{
  "content": "The improved content here (markdown supported)",
  "changes": "Brief explanation of what was changed"
}`;

    const userPrompt = `Original content:\n\n${request.content}`;

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
      "3-columns": "3 columns - equal width",
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
