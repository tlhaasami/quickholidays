import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Ignore files with extensions (images, fonts, stylesheets) and Next.js internal calls (HMR, static scripts)
  const isStaticFileOrInternal = 
    url.pathname.includes(".") || 
    url.pathname.startsWith("/_next") || 
    url.pathname.includes("webpack-hmr");

  if (isStaticFileOrInternal) {
    return NextResponse.next();
  }

  const hostname = request.headers.get("host") || "";
  const isSubdomainAdmin = hostname.startsWith("admin.");
  const isNetlifyDefault = hostname.includes("netlify.app");

  // If trying to access /admin directly from the main domain (e.g. localhost:3000/admin), block it with a 404,
  // EXCEPT when on Netlify's default domain (where admin. subdomain is not possible due to SSL restrictions)
  if (url.pathname.startsWith("/admin") && !isSubdomainAdmin && !isNetlifyDefault) {
    url.pathname = "/404";
    return NextResponse.rewrite(url);
  }

  // If subdomain is admin. (e.g. admin.localhost:3000)
  if (isSubdomainAdmin) {
    // If request doesn't start with /admin already, rewrite it to the /admin route
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - favicon.ico (favicon file)
     * - icon.png (brand icon)
     */
    "/((?!api|favicon.ico|icon.png).*)",
  ],
};
