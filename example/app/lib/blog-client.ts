import { createClient } from "@/lib/supabase-server";
import { createBlogClient } from '@m14i/blogging-core';

export async function getBlogClient() {
  const supabase = await createClient();
  return createBlogClient(supabase, {
    schema: "blog",
    postsTable: "posts",
    mediaTable: "media",
    includeAuthor: false,
  });
}
