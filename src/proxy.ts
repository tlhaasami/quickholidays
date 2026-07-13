import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Ignore files with extensions (images, fonts, stylesheets) and Next.js internal calls (HMR, static scripts)
  const isStaticFileOrInternal = 
    url.pathname.includes(".") || 
    url.pathname.startsWith("/_next") || 
    url.pathname.includes("webpack-hmr");

  if (isStaticFileOrInternal) {
    return NextResponse.next();
  }

  // Redirect /home to /
  if (url.pathname === "/home" || url.pathname === "/home/") {
    const targetUrl = new URL("/", request.url);
    targetUrl.search = url.search;
    return NextResponse.redirect(targetUrl);
  }


  const hostname = request.headers.get("host") || "";
  const isSubdomainAdmin = hostname.startsWith("admin.");

  // Allow direct access to /admin on both main domain and subdomain (roles are validated in protected path check below)


  // If subdomain is admin. (e.g. admin.localhost:3000), rewrite to /admin
  let targetPathname = url.pathname;
  if (isSubdomainAdmin) {
    if (!url.pathname.startsWith("/admin")) {
      targetPathname = `/admin${url.pathname}`;
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", targetPathname);

  // Define response (either rewrite for subdomain or next for standard)
  let response = isSubdomainAdmin && !url.pathname.startsWith("/admin")
    ? NextResponse.rewrite(new URL(targetPathname, request.url), {
        request: {
          headers: requestHeaders,
        },
      })
    : NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

function getCookieDomain(host?: string | null) {
  if (!host) return undefined;
  const cleanHost = host.split(":")[0].toLowerCase();
  if (cleanHost === "localhost" || cleanHost.endsWith(".localhost")) {
    return "localhost";
  }
  if (cleanHost.endsWith(".netlify.app") || cleanHost.endsWith(".vercel.app")) {
    return undefined;
  }
  const parts = cleanHost.split(".");
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

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          const cookieDomain = getCookieDomain(hostname);
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = isSubdomainAdmin && !url.pathname.startsWith("/admin")
            ? NextResponse.rewrite(new URL(targetPathname, request.url), {
                request: {
                  headers: requestHeaders,
                },
              })
            : NextResponse.next({
                request: {
                  headers: requestHeaders,
                },
              });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, {
              ...options,
              domain: cookieDomain,
            })
          );
        },
      },
    }
  );

  // Cross-subdomain session synchronization handler
  const accessToken = url.searchParams.get("access_token");
  const refreshToken = url.searchParams.get("refresh_token");

  if (accessToken && refreshToken) {
    // Set the session on the current subdomain
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Redirect to clean URL without query parameters
    const cleanUrl = new URL(url.pathname, request.url);
    const cleanResponse = NextResponse.redirect(cleanUrl);

    // Sync cookie values back into redirect response
    request.cookies.getAll().forEach((cookie) => {
      cleanResponse.cookies.set(cookie.name, cookie.value);
    });

    return cleanResponse;
  }

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("username, role, status")
      .eq("id", user.id)
      .single();
    profile = userProfile;
  }

  // Protect internal routes based on rewritten targetPathname
  const isAgentDashboardPath = /^\/[a-zA-Z0-9_-]+\/agent-dashboard(?:$|\/)/.test(targetPathname);

  const isProtectedPath =
    targetPathname.startsWith("/admin") ||
    isAgentDashboardPath ||
    targetPathname.startsWith("/processing-dashboard");

  if (isProtectedPath) {
    if (!user) {
      if (isSubdomainAdmin) {
        // Sync session from main domain before forcing login
        const syncUrl = new URL("/api/sync-session", request.url);
        syncUrl.hostname = hostname.replace("admin.", ""); // point to main domain
        syncUrl.searchParams.set("redirect", request.url);
        return NextResponse.redirect(syncUrl);
      }

      const mainLoginUrl = new URL("/login", request.url);
      return NextResponse.redirect(mainLoginUrl);
    }

    if (profile) {
      if (profile.status !== "approved") {
        await supabase.auth.signOut();
        const mainLoginUrl = new URL("/login", request.url);
        if (isSubdomainAdmin) {
          mainLoginUrl.hostname = hostname.replace("admin.", "");
        }
        return NextResponse.redirect(mainLoginUrl);
      }

      // Check if trying to access admin panel but is not admin
      if (targetPathname.startsWith("/admin") && profile.role !== "admin") {
        // Sign out the user and redirect to login page
        await supabase.auth.signOut();
        const mainLoginUrl = new URL("/login", request.url);
        if (isSubdomainAdmin) {
          mainLoginUrl.hostname = hostname.replace("admin.", "");
        }
        return NextResponse.redirect(mainLoginUrl);
      }

      // Check if trying to access agent-dashboard but is not agent
      if (isAgentDashboardPath && profile.role !== "agent") {
        let redirectPath = "/";
        if (profile.role === "admin") {
          if (isSubdomainAdmin) {
            return NextResponse.redirect(new URL("/", request.url));
          } else {
            return NextResponse.redirect(new URL("/admin", request.url));
          }
        } else if (profile.role === "processor") {
          redirectPath = "/processing-dashboard";
        }
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }

      // Check if trying to access processing-dashboard but is not processor
      if (targetPathname.startsWith("/processing-dashboard") && profile.role !== "processor") {
        let redirectPath = "/";
        if (profile.role === "admin") {
          if (isSubdomainAdmin) {
            return NextResponse.redirect(new URL("/", request.url));
          } else {
            return NextResponse.redirect(new URL("/admin", request.url));
          }
        } else if (profile.role === "agent") {
          redirectPath = `/${profile?.username?.toLowerCase() || "agent"}/agent-dashboard`;
        }
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    } else {
      // User is logged in but has no profile record (e.g. deleted or error)
      await supabase.auth.signOut();
      const mainLoginUrl = new URL("/login", request.url);
      if (isSubdomainAdmin) {
        mainLoginUrl.hostname = hostname.replace("admin.", "");
      }
      return NextResponse.redirect(mainLoginUrl);
    }
  }

  // If logged in, restrict /login from being accessed
  if (targetPathname.startsWith("/login") && user && profile) {
    if (profile.status === "approved") {
      let redirectPath = "/";
      if (profile.role === "admin") {
        if (isSubdomainAdmin) {
          return NextResponse.redirect(new URL("/", request.url));
        } else {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } else if (profile.role === "processor") {
        redirectPath = "/processing-dashboard";
      } else {
        redirectPath = `/${profile?.username?.toLowerCase() || "agent"}/agent-dashboard`;
      }
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|assets).*)",
  ],
};
