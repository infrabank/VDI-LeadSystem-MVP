import type { MetadataRoute } from "next";
import { company } from "@/lib/site-config";

const base = `https://${company.domain}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
          "/portal",
          "/portal/",
          "/reports/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
