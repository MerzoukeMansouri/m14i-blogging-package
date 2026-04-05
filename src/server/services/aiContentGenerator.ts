/**
 * AI Content Generator Service
 * Handles AI-powered blog content generation using Claude API
 * Now with TOON-optimized prompts (70-80% token reduction)
 */

import Anthropic from "@anthropic-ai/sdk";
import type { LayoutSection, LayoutType } from "../../types/layouts";
import type { ContentBlock, TextBlock, QuoteBlock } from "../../types/blocks";
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
} from "../../types/aiGeneration";
import {
  generateLayoutPrompt,
  generateSectionPrompt,
  generateCompletePrompt,
  generateSEOPrompt,
  generateImprovePrompt,
} from "./ai-prompts-compact";

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
   * Generate layout structure only (Step 1)
   * Returns title, excerpt, and section structure without content
   * Now using TOON-optimized prompts with multilingual support
   */
  async generateLayout(
    request: GenerateLayoutRequest
  ): Promise<GenerateLayoutResponse> {
    const systemPrompt = generateLayoutPrompt({
      length: request.length,
      layoutPreference: request.layoutPreference,
      tone: request.tone,
      additionalInstructions: request.additionalInstructions,
      language: request.language || "en",
    });

    const lang = request.language || "en";
    const userPrompt = lang === "fr"
      ? `Générer la structure du blog pour : ${request.prompt}`
      : `Generate blog post layout for: ${request.prompt}`;

    const message = await this.anthropic.messages.create({
      model: this.config.model,
      max_tokens: 1000, // Small response - just structure
      temperature: this.config.temperature,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
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

    const cleanedText = stripMarkdownCodeBlocks(responseText);

    try {
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error("JSON Parse Error (Layout):", error);
      console.error("Response:", cleanedText);
      throw new Error(`Failed to parse layout response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a complete blog post from a prompt
   * Now with multilingual support
   */
  async generateCompleteBlogPost(
    request: GenerateCompleteBlogRequest
  ): Promise<GenerateCompleteBlogResponse> {
    const systemPrompt = this.buildCompleteBlogPrompt(request);
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

    return result;
  }

  /**
   * Generate a complete blog post with streaming (faster perceived performance)
   * Returns an async generator that yields text chunks
   * Now with multilingual support
   */
  async *generateCompleteBlogPostStream(
    request: GenerateCompleteBlogRequest
  ): AsyncGenerator<string, void, undefined> {
    const systemPrompt = this.buildCompleteBlogPrompt(request);
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
  private buildCompleteBlogPrompt(request: GenerateCompleteBlogRequest): string {
    return generateCompletePrompt({
      tone: request.tone,
      length: request.length,
      layoutPreference: request.layoutPreference,
      additionalInstructions: request.additionalInstructions,
      language: request.language || "en",
    });
  }

  /**
   * Build the OLD verbose prompt for blog post generation (DEPRECATED - kept for reference)
   * @deprecated Use buildCompleteBlogPrompt() which uses TOON format
   */
  private buildCompleteBlogPromptOLD(request: GenerateCompleteBlogRequest): string {
    return `You are an expert blog content writer specializing in creating elegant, visually engaging blog posts with sophisticated layouts.

⚠️ CRITICAL: YOUR RESPONSE MUST BE 100% VALID JSON ⚠️

JSON FORMATTING RULES - ZERO TOLERANCE FOR ERRORS:
1. Response starts with { and ends with } - NOTHING ELSE
2. NO markdown code blocks (no \`\`\`json or \`\`\`)
3. NO explanatory text before or after the JSON
4. ALL quotes inside strings MUST be escaped: use \\" not "
5. NO literal line breaks in strings - use \\n instead
6. NO trailing commas after the last item in arrays or objects
7. ALL object keys must be in "double quotes"
8. Close EVERY bracket and brace you open
9. Double-check your JSON is valid before responding

COMMON MISTAKES TO AVOID:
❌ "content": "She said "hello""  → ✅ "content": "She said \\"hello\\""
❌ "content": "First line
Second line"  → ✅ "content": "First line\\nSecond line"
❌ "tags": ["tag1", "tag2",]  → ✅ "tags": ["tag1", "tag2"]
❌ {title: "Post"}  → ✅ {"title": "Post"}
❌ \`\`\`json\\n{...}\\n\`\`\`  → ✅ {...}

If you're unsure about JSON syntax:
- Every opening { needs a closing }
- Every opening [ needs a closing ]
- Every string needs exactly 2 unescaped quotes (start and end)
- Commas separate items, but NO comma after the last item
- Property names and string values both need "double quotes"

BEFORE YOU RESPOND: Mentally validate your JSON structure is correct.

# CONTENT PHILOSOPHY
Create content that is:
- **Scannable**: Use headings, short paragraphs, and visual breaks
- **Engaging**: Hook readers immediately, maintain interest throughout
- **Actionable**: Provide practical value and clear takeaways
- **Visual**: Use layouts to create visual hierarchy and breathing room
- **Elegant**: Professional tone with conversational warmth

# LAYOUT TYPES & BEST PRACTICES

**1-column** (Full-width)
- Use for: Hero sections, introductions, conclusions, long-form narrative
- Example: Opening hook, main thesis, final call-to-action

**2-columns** (Equal width - 50/50)
- Use for: Comparisons, before/after, pros/cons, complementary points
- Example: "Traditional vs Modern", "Benefits vs Challenges"

**2-columns-wide-left** (66/33)
- Use for: Main content + sidebar tip, primary + supporting info
- Example: Main explanation (left) + quick tip or stat (right)

**2-columns-wide-right** (33/66)
- Use for: Icon/visual + detailed explanation
- Example: Key point (left) + detailed breakdown (right)

**3-columns** (Equal width - 33/33/33)
- Use for: Features, benefits, steps, listicles
- Example: "3 Core Principles", "Key Features"

**grid-4-even** (2x2)
- Use for: Four equal items, quadrants, balanced features
- Example: "4 Essential Tools", "Key Metrics"

# CONTENT STRUCTURE GUIDELINES

**Opening Section** (1-column):
- Strong hook (question, stat, or bold statement)
- Clear value proposition (what reader will learn)
- Brief context (why this matters now)
- 2-3 paragraphs maximum
- Consider adding a hero image or video for visual impact

**Body Sections** (varied layouts):
- Mix 2-column and 3-column layouts for visual rhythm
- Each section: 1 clear topic with 2-4 supporting points
- Use subheadings (## and ###) liberally
- Include specific examples, data, or case studies
- Add images, videos, or carousels to break up text and enhance understanding

**Visual Content Placement**:
- Use images to illustrate concepts, show examples, or add visual interest
- Use videos for tutorials, demonstrations, or embedded content
- Place visual content strategically (not every section needs visuals)
- In multi-column layouts, balance text and visuals across columns

**Quotes** (strategic placement):
- Use sparingly (1-2 per post maximum)
- Place in 2-column layouts for visual interest
- Include author/source for credibility

**Closing Section** (1-column):
- Synthesize key takeaways (3-5 bullet points)
- Clear next step or call-to-action
- Forward-looking statement

# MARKDOWN FORMATTING
Use markdown to enhance readability:
- **Bold** for key terms and emphasis
- *Italics* for subtle emphasis or terms
- \`code\` for technical terms, commands, or inline code
- Lists (- or 1.) for scannable points
- ## Headings for section structure
- > Blockquotes sparingly for impact

# WRITING STYLE
- Start sections with clear, descriptive headings
- Use active voice and concrete language
- Vary sentence length (mix short punchy sentences with longer explanatory ones)
- Include transitions between sections
- Add specificity (numbers, examples, real scenarios)

# AVAILABLE CONTENT BLOCKS

**text** - Rich text content with markdown support
{
  "id": "unique-id",
  "type": "text",
  "content": "Markdown content here with **bold**, *italic*, lists, etc."
}

**image** - Visual content with optional caption
{
  "id": "unique-id",
  "type": "image",
  "src": "https://example.com/image.jpg",
  "alt": "Descriptive alt text",
  "caption": "Optional caption text"
}

**video** - Embedded video (YouTube, Vimeo, etc.)
{
  "id": "unique-id",
  "type": "video",
  "url": "https://youtube.com/watch?v=...",
  "caption": "Optional video description"
}

**quote** - Pull quote or testimonial
{
  "id": "unique-id",
  "type": "quote",
  "content": "The quote text",
  "author": "Person Name",
  "role": "Title or Company"
}

**carousel** - Image gallery/slideshow
{
  "id": "unique-id",
  "type": "carousel",
  "slides": [
    {"src": "url1", "alt": "desc1", "caption": "caption1"},
    {"src": "url2", "alt": "desc2", "caption": "caption2"}
  ],
  "autoPlay": true,
  "aspectRatio": "16/9"
}

**pdf** - PDF document embed or download
{
  "id": "unique-id",
  "type": "pdf",
  "url": "https://example.com/document.pdf",
  "title": "Document Title",
  "description": "Brief description",
  "displayMode": "both"
}

**IMPORTANT**: For image, video, carousel, and PDF blocks:
- Use placeholder URLs like "https://placeholder.example/image-name.jpg"
- Use descriptive placeholder names that indicate what image/video should go there
- Add clear captions/descriptions so users know what content to add
- Example: "https://placeholder.example/data-visualization-chart.jpg"

# EXPECTED JSON STRUCTURE

You must return a JSON object with this EXACT structure (remove all comments):

{
  "title": "Your Compelling Blog Post Title Here",
  "slug": "your-blog-post-url-slug",
  "excerpt": "A concise 150-160 character summary that hooks readers and encourages them to read more of your content.",
  "sections": [
    {
      "id": "section-1",
      "type": "1-column",
      "columns": [
        [
          {
            "id": "block-1",
            "type": "text",
            "content": "## Introduction\\n\\nThis is the opening paragraph with **bold** and *italic* text.\\n\\nSecond paragraph continues here."
          },
          {
            "id": "block-2",
            "type": "image",
            "src": "https://placeholder.example/hero-image.jpg",
            "alt": "Descriptive alt text for the hero image",
            "caption": "Optional caption explaining the image"
          }
        ]
      ]
    },
    {
      "id": "section-2",
      "type": "2-columns",
      "columns": [
        [
          {
            "id": "block-3",
            "type": "text",
            "content": "## First Column Heading\\n\\nContent for the first column goes here."
          }
        ],
        [
          {
            "id": "block-4",
            "type": "quote",
            "content": "This is an inspiring quote that adds credibility.",
            "author": "Expert Name",
            "role": "CEO, Company Name"
          }
        ]
      ]
    },
    {
      "id": "section-3",
      "type": "3-columns",
      "columns": [
        [
          {
            "id": "block-5",
            "type": "text",
            "content": "### Feature One\\n\\nDescription of the first feature."
          }
        ],
        [
          {
            "id": "block-6",
            "type": "text",
            "content": "### Feature Two\\n\\nDescription of the second feature."
          }
        ],
        [
          {
            "id": "block-7",
            "type": "text",
            "content": "### Feature Three\\n\\nDescription of the third feature."
          }
        ]
      ]
    }
  ],
  "seo_metadata": {
    "description": "A clear, benefit-focused meta description under 160 characters that encourages clicks.",
    "keywords": ["primary-keyword", "secondary-keyword", "long-tail-keyword"],
    "robots": "index, follow",
    "openGraph": {
      "title": "Social Media Optimized Title",
      "description": "Engaging description for social media sharing."
    },
    "twitter": {
      "card": "summary_large_image",
      "title": "Twitter-Optimized Title",
      "description": "Twitter-specific description."
    }
  },
  "category": "Technology",
  "tags": ["web-development", "react", "performance", "best-practices"]
}

CRITICAL REMINDERS:
- ALL strings must use \\n for line breaks (never literal newlines)
- Escape ALL quotes inside strings with \\"
- Each block must have unique "id" field
- Each section must have unique "id" field
- Use only these layout types: "1-column", "2-columns", "3-columns", "2-columns-wide-left", "2-columns-wide-right", "grid-2x2", "grid-3x3", "grid-2x3", "grid-4-even"
- Use only these block types: "text", "image", "video", "quote", "carousel", "pdf"
- Number of columns array must match layout type (1-column = 1 array, 2-columns = 2 arrays, etc.)
- Start your response with { and end with } with nothing else before or after

${request.tone ? `Tone: ${request.tone}` : "Tone: Professional yet approachable, authoritative yet conversational"}
${request.length ? `Length: ${request.length}` : "Length: medium (5-7 sections, 800-1200 words)"}
${request.layoutPreference && request.layoutPreference.length > 0 ? `Preferred layouts: ${request.layoutPreference.join(", ")}. Use these layouts predominantly while maintaining visual variety.` : "Use varied layouts (2-col, 3-col, grids) for visual interest"}
${request.additionalInstructions ? `\n\nADDITIONAL INSTRUCTIONS:\n${request.additionalInstructions}` : ""}

⚠️ FINAL CHECKLIST BEFORE RESPONDING:
□ Does my response start with { and end with }?
□ Did I escape ALL quotes inside strings with \\"?
□ Did I replace ALL line breaks with \\n?
□ Did I remove ALL trailing commas?
□ Are ALL property names in "double quotes"?
□ Did I avoid markdown code blocks?
□ Is every bracket properly closed?

RESPOND ONLY WITH VALID JSON NOW:`;
  }

  /**
   * Generate a single section with specific layout
   * Now using TOON-optimized prompts with multilingual support
   */
  async generateSection(
    request: GenerateSectionRequest
  ): Promise<GenerateSectionResponse> {
    const systemPrompt = generateSectionPrompt(
      request.layoutType,
      request.context,
      request.language || "en"
    );

    const lang = request.language || "en";
    const userPrompt = lang === "fr"
      ? `Générer une section sur : ${request.prompt}`
      : `Generate a section about: ${request.prompt}`;

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
    const result = JSON.parse(cleanedText) as GenerateSEOResponse;

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
