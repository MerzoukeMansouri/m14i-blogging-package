/**
 * Supabase Client Setup for Next.js
 *
 * This file demonstrates how to set up Supabase clients for different contexts:
 * - Client-side (browser)
 * - Server-side (Server Components, API Routes)
 * - Server Actions
 */

import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================
// Add these to your .env.local file:
//
// NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
// SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (for admin operations)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ============================================================================
// CLIENT-SIDE SUPABASE CLIENT
// ============================================================================

/**
 * Client-side Supabase client for use in Client Components
 *
 * Usage in Client Components:
 * ```tsx
 * 'use client';
 * import { supabaseClient } from '@/lib/supabase-client';
 *
 * const { data } = await supabaseClient
 *   .from('blog.posts')
 *   .select('*')
 *   .eq('status', 'published');
 * ```
 */
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ============================================================================
// SERVER-SIDE SUPABASE CLIENT
// ============================================================================

/**
 * Server-side Supabase client for use in Server Components and API Routes
 *
 * This client respects Row Level Security (RLS) and uses the user's session
 *
 * Usage in Server Components:
 * ```tsx
 * import { createServerSupabaseClient } from '@/lib/supabase-client';
 *
 * export default async function PostsPage() {
 *   const supabase = createServerSupabaseClient();
 *   const { data } = await supabase
 *     .from('blog.posts')
 *     .select('*')
 *     .eq('status', 'published');
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

// ============================================================================
// ADMIN SUPABASE CLIENT (Bypasses RLS)
// ============================================================================

/**
 * Admin Supabase client that bypasses Row Level Security
 *
 * ⚠️ USE WITH CAUTION - This client has full access to all data
 *
 * Only use this for:
 * - Server-side admin operations
 * - Migrations and maintenance
 * - Background jobs
 *
 * Usage in API Routes:
 * ```tsx
 * import { supabaseAdmin } from '@/lib/supabase-client';
 *
 * export async function POST(request: Request) {
 *   // Verify user is admin first!
 *   const { data } = await supabaseAdmin
 *     .from('blog.posts')
 *     .insert({ ... });
 *
 *   return Response.json(data);
 * }
 * ```
 */
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if current user is admin
 */
export async function isAdmin(supabase: ReturnType<typeof createServerSupabaseClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // Check if user has admin role in metadata
  return user.user_metadata?.role === 'admin';
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(
  supabase: ReturnType<typeof createServerSupabaseClient>
) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return user;
}

/**
 * Require admin access (throws if not admin)
 */
export async function requireAdmin(
  supabase: ReturnType<typeof createServerSupabaseClient>
) {
  const admin = await isAdmin(supabase);

  if (!admin) {
    throw new Error('Unauthorized: Admin access required');
  }

  const user = await getCurrentUser(supabase);
  return user!;
}
