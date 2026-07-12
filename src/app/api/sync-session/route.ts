import { createServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let redirect = searchParams.get("redirect") || "/";

  // Enforce relative path to prevent open redirect vulnerabilities
  if (!redirect.startsWith("/") || redirect.startsWith("//")) {
    redirect = "/";
  }

  const supabase = await createServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    const redirectUrl = new URL(redirect, request.url);
    redirectUrl.searchParams.set("access_token", session.access_token);
    redirectUrl.searchParams.set("refresh_token", session.refresh_token);
    return NextResponse.redirect(redirectUrl);
  }

  // Not logged in: go to login on main domain
  const mainLoginUrl = new URL("/login", request.url);
  const hostname = request.headers.get("host") || "";
  if (hostname.startsWith("admin.")) {
    mainLoginUrl.hostname = hostname.replace("admin.", "");
  }
  return NextResponse.redirect(mainLoginUrl);
}
