import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cobage.joeltech.dev";

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/about",
          "/how-it-works",
          "/faq",
          "/contact",
          "/legal/*",
        ],
        disallow: [
          "/dashboard/*",
          "/admin/*",
          "/api/*",
          "/auth/*",
          "/server/*",
          "/_next/*",
          "/static/*",
          "/uploads/private/*",
        ],
        crawlDelay: 0,
      },

      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/dashboard/*",
          "/admin/*",
          "/api/*",
          "/auth/*",
          "/server/*",
          "/_next/*",
          "/static/*",
          "/uploads/private/*",
          "/__nextjs_original-stack-frame",
        ],
        crawlDelay: 0,
      },

      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "CCBot",
          "anthropic-ai",
          "PerplexityBot",
        ],
        disallow: ["/"],
      },
    ],

    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
