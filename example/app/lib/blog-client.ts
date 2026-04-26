import { createClient } from "@/lib/supabase-server";
import { createBlogClient } from '@m14i/blogging-core/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function getBlogClient() {
  // Use service role key in demo mode to bypass RLS
  if (process.env.DEMO_AUTH_BYPASS === "true" && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    return createBlogClient(supabase, {
      schema: "blog",
      postsTable: "posts",
      mediaTable: "media",
      includeAuthor: false,
    });
  }

  const supabase = await createClient();
  return createBlogClient(supabase, {
    schema: "blog",
    postsTable: "posts",
    mediaTable: "media",
    includeAuthor: false,
  });
}
