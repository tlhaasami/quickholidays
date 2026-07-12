import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://quickholidays.co.uk";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/agent-dashboard", "/processing-dashboard", "/visa-form"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
