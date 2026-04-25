import { createImproveContentRoute } from '@m14i/blogging-server';
import { createClient } from "@/lib/supabase-server";

// Demo mode: skip auth (matches isAllowed={true} on admin panel)
export const { POST } = createImproveContentRoute({
  supabase: () => createClient(),
  isAdmin: () => Promise.resolve(true),
});
