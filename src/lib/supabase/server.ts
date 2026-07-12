import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

function getCookieDomain(host?: string | null) {
  if (!host) return undefined;
  const cleanHost = host.split(":")[0];
  if (cleanHost === "localhost" || cleanHost.endsWith(".localhost")) {
    return "localhost";
  }
  if (cleanHost.endsWith(".netlify.app")) {
    return undefined;
  }
  const parts = cleanHost.split(".");
  if (parts.length >= 2) {
    return "." + parts.slice(-2).join(".");
  }
  return undefined;
}

export async function createServer() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const host = headersList.get("host");
  const domain = getCookieDomain(host);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                domain: domain,
              })
            );
          } catch {
            // Ignore if called from Server Component
          }
        },
      },
    }
  );
}
