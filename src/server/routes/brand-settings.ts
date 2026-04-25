/**
 * Brand Settings API Route Handlers
 *
 * Factory functions for managing brand context/voice settings
 */

import type { RouteConfig } from "../types";
import {
  requireAdmin,
  handleError,
  errorResponse,
  successResponse,
  getSupabaseClient,
} from "../utils";

/**
 * Create GET/PUT handlers for /api/blog/brand-settings
 *
 * Manages brand context stored in database
 *
 * @example
 * ```typescript
 * // app/api/blog/brand-settings/route.ts
 * import { createBrandSettingsRoute } from 'm14i-blogging/server';
 * import { supabase } from '@/lib/supabase-client';
 *
 * export const { GET, PUT } = createBrandSettingsRoute({ supabase });
 * ```
 */
export function createBrandSettingsRoute(config: RouteConfig) {
  async function GET(request: Request) {
    try {
      // Require admin access
      await requireAdmin(config);

      const supabase = await getSupabaseClient(config);
      const { data, error } = await supabase
        .from("blog_brand_settings")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned (expected if not configured yet)
        throw error;
      }

      return successResponse(data || {});
    } catch (error: any) {
      const message = handleError(error, config);
      return errorResponse(message, 500);
    }
  }

  async function PUT(request: Request) {
    try {
      // Require admin access
      await requireAdmin(config);

      const body = await request.json();

      // Validate required fields
      if (!body.site_name || typeof body.site_name !== "string") {
        return errorResponse("site_name is required and must be a string", 400);
      }

      const supabase = await getSupabaseClient(config);

      // Get existing row (there should only be one)
      const { data: existing, error: fetchError } = await supabase
        .from("blog_brand_settings")
        .select("id")
        .single();

      if (fetchError || !existing) {
        console.error("Failed to fetch existing brand settings:", fetchError);
        return errorResponse("Failed to fetch existing settings", 500);
      }

      // Update existing row
      const { data, error } = await supabase
        .from("blog_brand_settings")
        .update({
          site_name: body.site_name,
          description: body.description || null,
          industry: body.industry || null,
          target_audience: body.target_audience || null,
          tone: body.tone || null,
          vocabulary_prefer: (body.vocabulary_prefer && body.vocabulary_prefer.length > 0) ? body.vocabulary_prefer : null,
          vocabulary_avoid: (body.vocabulary_avoid && body.vocabulary_avoid.length > 0) ? body.vocabulary_avoid : null,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Failed to update brand settings:", error);
        throw error;
      }

      return successResponse(data);
    } catch (error: any) {
      console.error("Brand settings PUT error:", error);
      const message = handleError(error, config);
      return errorResponse(message, 500);
    }
  }

  return { GET, PUT };
}
