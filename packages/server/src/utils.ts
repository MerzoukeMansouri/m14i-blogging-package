/**
 * Server-side utilities for API route handlers
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { RouteConfig } from './types';

/**
 * Get Supabase client from config
 */
export async function getSupabaseClient(
  config: RouteConfig
): Promise<SupabaseClient> {
  if (typeof config.supabase === 'function') {
    return await config.supabase();
  }
  return config.supabase;
}

/**
 * Check if user is authenticated
 */
export async function checkAuth(
  config: RouteConfig
): Promise<{ id: string; role?: string } | null> {
  if (config.getUser) {
    return await config.getUser();
  }

  // Default: use Supabase auth
  const supabase = await getSupabaseClient(config);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    role: user.user_metadata?.role,
  };
}

/**
 * Check if user is admin
 */
export async function checkAdmin(config: RouteConfig): Promise<boolean> {
  if (config.isAdmin) {
    return await config.isAdmin();
  }

  // Default: check user metadata
  const user = await checkAuth(config);
  return user?.role === 'admin';
}

/**
 * Require admin access (throws if not admin)
 */
export async function requireAdmin(config: RouteConfig): Promise<void> {
  const isAdmin = await checkAdmin(config);
  if (!isAdmin) {
    throw new Error('Unauthorized: Admin access required');
  }
}

/**
 * Handle errors consistently
 */
export function handleError(error: unknown, config?: RouteConfig): string {
  const message = error instanceof Error ? error.message : 'An error occurred';

  if (config?.onError && error instanceof Error) {
    config.onError(error);
  }

  return message;
}

/**
 * Parse query parameters from URL
 */
export function parseQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const urlObj = new URL(url);

  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Parse integer from query param with default
 */
export function parseIntParam(
  value: string | undefined,
  defaultValue: number
): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Create JSON response helper
 */
export function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create error response helper
 */
export function errorResponse(error: string, status: number = 400): Response {
  return jsonResponse({ error }, status);
}

/**
 * Create success response helper
 */
export function successResponse(data: any, status: number = 200): Response {
  return jsonResponse(data, status);
}
