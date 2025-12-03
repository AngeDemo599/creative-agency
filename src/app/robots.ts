import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://newin.dz";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/controle-center/",
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
