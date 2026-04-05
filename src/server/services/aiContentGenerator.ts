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
 * Handles various formats that Claude might use
 */
function stripMarkdownCodeBlocks(text: string): string {
  let cleaned = text.trim();

  // Remove ```json ... ``` or ``` ... ``` wrapping (multiline)
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/m, '');
  cleaned = cleaned.replace(/\n?```\s*$/m, '');

  // Remove any remaining backticks at start/end
  cleaned = cleaned.replace(/^`+\s*/, '');
  cleaned = cleaned.replace(/\s*`+$/, '');

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
   * Generate a complete blog post from a prompt
   */
  async generateCompleteBlogPost(
    request: GenerateCompleteBlogRequest
  ): Promise<GenerateCompleteBlogResponse> {
    const systemPrompt = this.buildCompleteBlogPrompt(request);
    const userPrompt = `Generate a complete blog post about: ${request.prompt}`;

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
    const result = JSON.parse(cleanedText) as GenerateCompleteBlogResponse;

    return result;
  }

  /**
   * Generate a complete blog post with streaming (faster perceived performance)
   * Returns an async generator that yields text chunks
   */
  async *generateCompleteBlogPostStream(
    request: GenerateCompleteBlogRequest
  ): AsyncGenerator<string, void, undefined> {
    const systemPrompt = this.buildCompleteBlogPrompt(request);
    const userPrompt = `Generate a complete blog post about: ${request.prompt}`;

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
   */
  private buildCompleteBlogPrompt(request: GenerateCompleteBlogRequest): string {
    return `You are an expert blog content writer specializing in creating elegant, visually engaging blog posts with sophisticated layouts.

CRITICAL JSON FORMATTING RULES - MUST FOLLOW EXACTLY:
1. Your ENTIRE response must be a single valid JSON object
2. DO NOT wrap the JSON in markdown code blocks (no \`\`\`json or \`\`\`)
3. DO NOT add any text before or after the JSON
4. All string values MUST have properly escaped quotes: use \\" for quotes inside strings
5. All strings MUST be on a single line (no literal newlines in string values)
6. Use \\n for line breaks inside string content
7. Ensure all brackets and braces are properly closed
8. Test that your response is valid JSON before returning it

WRONG EXAMPLES:
❌ \`\`\`json {...}\`\`\`  (no markdown)
❌ Here is the JSON: {...}  (no extra text)
❌ "content": "This is a "quote""  (escape quotes as \\\")
❌ "content": "Line 1
Line 2"  (use \\n instead)

CORRECT EXAMPLE:
✅ {"title":"My Post","content":"This is a \\"quote\\" and\\nthis is a new line"}

Your response must start with { and end with } with nothing else.

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
${request.additionalInstructions ? `\n\nADDITIONAL INSTRUCTIONS:\n${request.additionalInstructions}` : ""}`;
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

Each column is an array of content blocks. Available block types:
- text: { id: string, type: "text", content: string (markdown supported) }
- image: { id: string, type: "image", src: string, alt: string, caption?: string }
- video: { id: string, type: "video", url: string, caption?: string }
- quote: { id: string, type: "quote", content: string, author?: string, role?: string }
- carousel: { id: string, type: "carousel", slides: [{src, alt, caption}], autoPlay?: boolean, aspectRatio?: "16/9" }
- pdf: { id: string, type: "pdf", url: string, title?: string, description?: string, displayMode?: "both" }

For media blocks (image/video/carousel/pdf), use placeholder URLs like "https://placeholder.example/descriptive-name.jpg"

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
