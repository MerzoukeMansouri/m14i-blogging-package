/**
 * AI Generation API Route Handlers
 *
 * Factory functions that create Next.js route handlers for AI-powered content generation
 */

import type { RouteConfig } from "../types";
import {
  requireAdmin,
  handleError,
  jsonResponse,
  errorResponse,
  successResponse,
  getSupabaseClient,
} from "../utils";
import { AIContentGenerator, createAIContentGenerator } from "../services/aiContentGenerator";
import { applyRateLimit, getRateLimiter } from "../middleware/rateLimit";
import type {
  GenerateCompleteBlogRequest,
  GenerateSectionRequest,
  GenerateSEORequest,
  ImproveContentRequest,
} from "../types/aiGeneration";

// Default rate limit configuration
const DEFAULT_RATE_LIMIT = {
  requests: 10,
  window: 60 * 60, // 1 hour in seconds
};

/**
 * Create POST handler for /api/blog/generate/complete
 *
 * Generates a complete blog post from a prompt
 *
 * @example
 * ```typescript
 * // app/api/blog/generate/complete/route.ts
 * import { createGenerateCompleteRoute } from 'm14i-blogging/server';
 * import { supabase } from '@/lib/supabase-client';
 *
 * export const { POST } = createGenerateCompleteRoute({ supabase });
 * ```
 */
export function createGenerateCompleteRoute(config: RouteConfig) {
  async function POST(request: Request) {
    try {
      // Require admin access
      await requireAdmin(config);

      // Apply rate limiting (5 full blog posts per hour)
      const rateLimit = applyRateLimit(request, {
        limit: 5,
        windowMs: 60 * 60 * 1000, // 1 hour
      });

      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again later.",
            resetTime: new Date(rateLimit.resetTime).toISOString(),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              ...rateLimit.headers,
            },
          }
        );
      }

      const body = (await request.json()) as GenerateCompleteBlogRequest;

      if (!body.prompt || typeof body.prompt !== "string") {
        return errorResponse("Prompt is required and must be a string", 400);
      }

      // Create AI generator
      const generator = createAIContentGenerator();

      // Generate complete blog post
      const result = await generator.generateCompleteBlogPost(body);

      return successResponse(result);
    } catch (error: any) {
      // Handle specific error cases
      if (error.message?.includes("ANTHROPIC_API_KEY")) {
        return errorResponse(
          "AI service not configured. Please set ANTHROPIC_API_KEY environment variable.",
          500
        );
      }

      if (error.status === 429) {
        return errorResponse(
          "Rate limit exceeded. Please try again later.",
          429
        );
      }

      const message = handleError(error, config);
      return errorResponse(message, 500);
    }
  }

  return { POST };
}

/**
 * Create POST handler for /api/blog/generate/section
 *
 * Generates a single section with specified layout
 *
 * @example
 * ```typescript
 * // app/api/blog/generate/section/route.ts
 * import { createGenerateSectionRoute } from 'm14i-blogging/server';
 * import { supabase } from '@/lib/supabase-client';
 *
 * export const { POST } = createGenerateSectionRoute({ supabase });
 * ```
 */
export function createGenerateSectionRoute(config: RouteConfig) {
  async function POST(request: Request) {
    try {
      // Require admin access
      await requireAdmin(config);

      // Apply rate limiting (20 sections per hour)
      const rateLimit = applyRateLimit(request, {
        limit: 20,
        windowMs: 60 * 60 * 1000, // 1 hour
      });

      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again later.",
            resetTime: new Date(rateLimit.resetTime).toISOString(),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              ...rateLimit.headers,
            },
          }
        );
      }

      const body = (await request.json()) as GenerateSectionRequest;

      if (!body.prompt || typeof body.prompt !== "string") {
        return errorResponse("Prompt is required and must be a string", 400);
      }

      if (!body.layoutType) {
        return errorResponse("Layout type is required", 400);
      }

      // Validate layout type
      const validLayouts = [
        "1-column",
        "2-columns",
        "2-columns-wide-left",
        "2-columns-wide-right",
        "grid-2x2",
      ];

      if (!validLayouts.includes(body.layoutType)) {
        return errorResponse(
          `Invalid layout type. Must be one of: ${validLayouts.join(", ")}`,
          400
        );
      }

      // Create AI generator
      const generator = createAIContentGenerator();

      // Generate section
      const result = await generator.generateSection(body);

      return successResponse(result);
    } catch (error: any) {
      if (error.message?.includes("ANTHROPIC_API_KEY")) {
        return errorResponse(
          "AI service not configured. Please set ANTHROPIC_API_KEY environment variable.",
          500
        );
      }

      if (error.status === 429) {
        return errorResponse(
          "Rate limit exceeded. Please try again later.",
          429
        );
      }

      const message = handleError(error, config);
      return errorResponse(message, 500);
    }
  }

  return { POST };
}

/**
 * Create POST handler for /api/blog/generate/seo
 *
 * Generates SEO metadata for a blog post
 *
 * @example
 * ```typescript
 * // app/api/blog/generate/seo/route.ts
 * import { createGenerateSEORoute } from 'm14i-blogging/server';
 * import { supabase } from '@/lib/supabase-client';
 *
 * export const { POST } = createGenerateSEORoute({ supabase });
 * ```
 */
export function createGenerateSEORoute(config: RouteConfig) {
  async function POST(request: Request) {
    try {
      // Require admin access
      await requireAdmin(config);

      // Apply rate limiting (30 SEO generations per hour)
      const rateLimit = applyRateLimit(request, {
        limit: 30,
        windowMs: 60 * 60 * 1000, // 1 hour
      });

      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again later.",
            resetTime: new Date(rateLimit.resetTime).toISOString(),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              ...rateLimit.headers,
            },
          }
        );
      }

      const body = (await request.json()) as GenerateSEORequest;

      if (!body.title || typeof body.title !== "string") {
        return errorResponse("Title is required and must be a string", 400);
      }

      // Create AI generator
      const generator = createAIContentGenerator();

      // Generate SEO metadata
      const result = await generator.generateSEO(body);

      return successResponse(result);
    } catch (error: any) {
      if (error.message?.includes("ANTHROPIC_API_KEY")) {
        return errorResponse(
          "AI service not configured. Please set ANTHROPIC_API_KEY environment variable.",
          500
        );
      }

      if (error.status === 429) {
        return errorResponse(
          "Rate limit exceeded. Please try again later.",
          429
        );
      }

      const message = handleError(error, config);
      return errorResponse(message, 500);
    }
  }

  return { POST };
}

/**
 * Create POST handler for /api/blog/generate/improve
 *
 * Improves existing content based on instruction
 *
 * @example
 * ```typescript
 * // app/api/blog/generate/improve/route.ts
 * import { createImproveContentRoute } from 'm14i-blogging/server';
 * import { supabase } from '@/lib/supabase-client';
 *
 * export const { POST } = createImproveContentRoute({ supabase });
 * ```
 */
export function createImproveContentRoute(config: RouteConfig) {
  async function POST(request: Request) {
    try {
      // Require admin access
      await requireAdmin(config);

      // Apply rate limiting (50 content improvements per hour)
      const rateLimit = applyRateLimit(request, {
        limit: 50,
        windowMs: 60 * 60 * 1000, // 1 hour
      });

      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again later.",
            resetTime: new Date(rateLimit.resetTime).toISOString(),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              ...rateLimit.headers,
            },
          }
        );
      }

      const body = (await request.json()) as ImproveContentRequest;

      if (!body.content || typeof body.content !== "string") {
        return errorResponse("Content is required and must be a string", 400);
      }

      if (!body.instruction) {
        return errorResponse("Instruction is required", 400);
      }

      // Validate instruction
      const validInstructions = [
        "expand",
        "shorten",
        "rewrite",
        "add-examples",
        "improve-clarity",
        "make-engaging",
      ];

      if (!validInstructions.includes(body.instruction)) {
        return errorResponse(
          `Invalid instruction. Must be one of: ${validInstructions.join(", ")}`,
          400
        );
      }

      // Create AI generator
      const generator = createAIContentGenerator();

      // Improve content
      const result = await generator.improveContent(body);

      return successResponse(result);
    } catch (error: any) {
      if (error.message?.includes("ANTHROPIC_API_KEY")) {
        return errorResponse(
          "AI service not configured. Please set ANTHROPIC_API_KEY environment variable.",
          500
        );
      }

      if (error.status === 429) {
        return errorResponse(
          "Rate limit exceeded. Please try again later.",
          429
        );
      }

      const message = handleError(error, config);
      return errorResponse(message, 500);
    }
  }

  return { POST };
}

/**
 * Create POST handler for /api/blog/generate/template
 *
 * Generate blog post from proven template structure
 *
 * @example
 * ```typescript
 * // app/api/blog/generate/template/route.ts
 * import { createGenerateFromTemplateRoute } from 'm14i-blogging/server';
 * import { supabase } from '@/lib/supabase-client';
 *
 * export const { POST } = createGenerateFromTemplateRoute({ supabase });
 * ```
 */
export function createGenerateFromTemplateRoute(config: RouteConfig) {
  async function POST(request: Request) {
    try {
      // Require admin access
      await requireAdmin(config);

      // Apply rate limiting (10 per hour)
      const rateLimit = applyRateLimit(request, {
        limit: 10,
        windowMs: 60 * 60 * 1000, // 1 hour
      });

      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again later.",
            resetTime: new Date(rateLimit.resetTime).toISOString(),
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              ...rateLimit.headers,
            },
          }
        );
      }

      const body = await request.json();

      // Validate required fields
      if (!body.prompt || typeof body.prompt !== "string") {
        return errorResponse("prompt is required and must be a string", 400);
      }
      if (!body.templateId || typeof body.templateId !== "string") {
        return errorResponse("templateId is required and must be a string", 400);
      }

      // Create AI generator
      const generator = createAIContentGenerator();

      // Get Supabase client for brand context
      const supabase = await getSupabaseClient(config);

      // Generate blog post from template
      const result = await generator.generateFromTemplate({
        prompt: body.prompt,
        templateId: body.templateId,
        language: body.language || "en",
        supabaseClient: supabase,
      });

      return successResponse(result);
    } catch (error: any) {
      if (error.message?.includes("ANTHROPIC_API_KEY")) {
        return errorResponse(
          "AI service not configured. Please set ANTHROPIC_API_KEY environment variable.",
          500
        );
      }

      if (error.status === 429) {
        return errorResponse(
          "Rate limit exceeded. Please try again later.",
          429
        );
      }

      const message = handleError(error, config);
      return errorResponse(message, 500);
    }
  }

  return { POST };
}
