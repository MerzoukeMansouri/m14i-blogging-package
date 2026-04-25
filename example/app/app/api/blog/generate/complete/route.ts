import { createGenerateCompleteRoute } from '@m14i/blogging-server';
import { createClient } from "@/lib/supabase-server";

// Demo mode: skip auth (matches isAllowed={true} on admin panel)
export const { POST } = createGenerateCompleteRoute({
  supabase: () => createClient(),
  isAdmin: () => Promise.resolve(true),
});
