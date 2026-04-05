# AI-Powered Content Generation

The m14i-blogging package includes powerful AI content generation features powered by Claude (Anthropic). These features help you create, improve, and optimize blog content with ease.

## Features

- **Full Blog Post Generation**: Generate complete blog posts from a simple topic or prompt
- **Section Generation**: Create individual sections with custom layouts
- **SEO Optimization**: Auto-generate SEO metadata including meta descriptions, keywords, and social media tags
- **Content Improvement**: Enhance existing text blocks with AI-powered improvements (expand, shorten, rewrite, add examples, etc.)

## Setup

### 1. Install Dependencies

The AI features require the `@anthropic-ai/sdk` package, which is included as a dev dependency:

```bash
pnpm install
```

### 2. Configure API Key

Get your Anthropic API key from [https://console.anthropic.com/](https://console.anthropic.com/) and add it to your environment variables:

```bash
# .env or .env.local
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 3. Create API Routes

Create the necessary API routes in your Next.js application:

#### Full Blog Post Generation

Create `app/api/blog/generate/complete/route.ts`:

```typescript
import { createGenerateCompleteRoute } from "m14i-blogging/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const { POST } = createGenerateCompleteRoute({
  supabase: createServerSupabaseClient,
});
```

#### Section Generation

Create `app/api/blog/generate/section/route.ts`:

```typescript
import { createGenerateSectionRoute } from "m14i-blogging/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const { POST } = createGenerateSectionRoute({
  supabase: createServerSupabaseClient,
});
```

#### SEO Generation

Create `app/api/blog/generate/seo/route.ts`:

```typescript
import { createGenerateSEORoute } from "m14i-blogging/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const { POST } = createGenerateSEORoute({
  supabase: createServerSupabaseClient,
});
```

#### Content Improvement

Create `app/api/blog/generate/improve/route.ts`:

```typescript
import { createImproveContentRoute } from "m14i-blogging/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const { POST } = createImproveContentRoute({
  supabase: createServerSupabaseClient,
});
```

## Usage

### In the Editor

The AI features are integrated directly into the blog post editor:

#### 1. AI Toolbar

Located at the top of the editor, the AI toolbar provides three main actions:

- **✨ Generate Full Post**: Opens a dialog to generate a complete blog post from a topic/prompt
- **➕ Generate Section**: Creates a new section with your chosen layout type
- **🔍 Generate SEO**: Auto-generates SEO metadata based on your post content

#### 2. Content Improvement

For each text block in the BlogBuilder, you'll see an "✨ AI Improve" button that offers:

- **📝 Expand**: Add more details and explanations
- **✂️ Shorten**: Make content more concise
- **🔄 Rewrite**: Rephrase for better clarity and flow
- **💡 Add Examples**: Insert relevant examples
- **🎯 Improve Clarity**: Make complex ideas easier to understand
- **⭐ Make Engaging**: Enhance readability and interest

### Programmatic Usage

You can also use the AI service directly in your server-side code:

```typescript
import { createAIContentGenerator } from "m14i-blogging/server";

const generator = createAIContentGenerator({
  // Optional: customize model and parameters
  model: "claude-3-5-sonnet-20241022",
  maxTokens: 4000,
  temperature: 0.7,
});

// Generate a complete blog post
const result = await generator.generateCompleteBlogPost({
  prompt: "Best practices for React performance optimization",
  length: "medium",
  tone: "technical",
});

// Generate a single section
const section = await generator.generateSection({
  prompt: "Benefits of server-side rendering",
  layoutType: "2-columns",
  context: "React Performance Guide",
});

// Generate SEO metadata
const seo = await generator.generateSEO({
  title: "React Performance Best Practices",
  excerpt: "Learn how to optimize your React applications...",
  category: "Web Development",
  tags: ["react", "performance", "optimization"],
});

// Improve existing content
const improved = await generator.improveContent({
  content: "React is fast...",
  instruction: "expand",
});
```

## Rate Limiting

To prevent abuse and control costs, the AI endpoints are rate-limited:

| Endpoint           | Rate Limit              |
| ------------------ | ----------------------- |
| Complete Blog Post | 5 requests per hour     |
| Section Generation | 20 requests per hour    |
| SEO Generation     | 30 requests per hour    |
| Content Improvement| 50 requests per hour    |

Rate limits are applied per IP address. When exceeded, the API returns a 429 status code with retry information.

### Custom Rate Limiting

You can customize rate limits by using the `applyRateLimit` middleware:

```typescript
import { applyRateLimit } from "m14i-blogging/server";

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, {
    limit: 10, // Custom limit
    windowMs: 60 * 60 * 1000, // 1 hour window
  });

  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        resetTime: new Date(rateLimit.resetTime).toISOString(),
      }),
      {
        status: 429,
        headers: rateLimit.headers,
      }
    );
  }

  // Process request...
}
```

## Error Handling

The AI features include comprehensive error handling:

### Client-Side

Errors are caught and displayed in the UI with user-friendly messages:

- API configuration errors
- Rate limit errors
- Network errors
- Generation failures

### Server-Side

API routes return appropriate error responses:

```json
{
  "error": "Error message",
  "code": "RATE_LIMIT" | "API_ERROR" | "INVALID_REQUEST" | "AUTHENTICATION_ERROR",
  "details": "Additional error details"
}
```

## Cost Considerations

AI-powered features use the Claude API, which charges based on token usage:

- **Full Blog Post**: ~2,000-4,000 tokens per generation
- **Section Generation**: ~500-1,000 tokens per section
- **SEO Generation**: ~200-500 tokens
- **Content Improvement**: ~500-2,000 tokens (depends on content length)

Current Claude pricing (as of 2024):
- Input: $3 per million tokens
- Output: $15 per million tokens

**Estimated costs**:
- Full blog post: $0.02 - $0.06 per generation
- Section: $0.01 - $0.02 per generation
- SEO: $0.005 - $0.01 per generation
- Improvement: $0.01 - $0.03 per improvement

Monitor your usage at [https://console.anthropic.com/](https://console.anthropic.com/).

## Advanced Configuration

### Custom AI Model

Change the AI model used for generation:

```typescript
const generator = createAIContentGenerator({
  model: "claude-3-opus-20240229", // More powerful but slower
  maxTokens: 8000,
  temperature: 0.9, // More creative
});
```

### Production Considerations

For production deployments:

1. **Use Redis-based rate limiting** instead of in-memory for multi-instance deployments
2. **Set up monitoring** to track API usage and costs
3. **Implement user-level rate limiting** in addition to IP-based limits
4. **Cache generated content** to avoid duplicate generations
5. **Add cost alerts** in your Anthropic console

## Troubleshooting

### "AI service not configured" Error

**Solution**: Ensure `ANTHROPIC_API_KEY` is set in your environment variables and restart your server.

### Rate Limit Exceeded

**Solution**: Wait for the rate limit window to reset (shown in the error message) or implement custom rate limits.

### Generation Takes Too Long

**Solution**:
- Reduce `maxTokens` in the configuration
- Use a faster model (sonnet instead of opus)
- Implement client-side loading indicators

### Unexpected Content Quality

**Solution**:
- Adjust the `temperature` parameter (lower = more focused, higher = more creative)
- Provide more context in prompts
- Use the "rewrite" improvement feature to refine results

## Support

For issues or questions:
- GitHub: [m14i-blogging issues](https://github.com/MerzoukeMansouri/m14i-blogging-package/issues)
- Anthropic Support: [https://support.anthropic.com](https://support.anthropic.com)
