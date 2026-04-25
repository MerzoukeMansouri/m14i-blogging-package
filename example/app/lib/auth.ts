import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function checkAuth(request: NextRequest): Promise<boolean> {
  if (process.env.DEMO_AUTH_BYPASS === "true") {
    return true;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.user_metadata?.role === "admin";
}
