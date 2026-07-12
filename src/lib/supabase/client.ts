import { createBrowserClient } from "@supabase/ssr";

function getCookieDomain() {
  if (typeof window === "undefined") return undefined;
  const hostname = window.location.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    return "localhost";
  }
  if (hostname.endsWith(".netlify.app")) {
    return undefined;
  }
  const parts = hostname.split(".");
  const isDoubleTld = parts.length >= 3 && [
    "co", "com", "org", "net", "ltd", "me", "plc", "sch", "ac", "gov"
  ].includes(parts[parts.length - 2]);

  if (isDoubleTld) {
    return "." + parts.slice(-3).join(".");
  } else {
    if (parts.length >= 2) {
      return "." + parts.slice(-2).join(".");
    }
  }
  return undefined;
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: getCookieDomain(),
        path: "/",
      }
    }
  );
}
