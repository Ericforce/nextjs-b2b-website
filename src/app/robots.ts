import type { MetadataRoute } from "next";

import { env } from "@/lib/env";
import { absoluteUrl, getMetadataDefaults, getSiteBaseUrl } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { siteSettings } = await getMetadataDefaults();
  const baseUrl = getSiteBaseUrl(siteSettings);
  const isProduction = env.app.env === "production";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: isProduction ? ["/studio"] : [],
      },
    ],
    sitemap: [absoluteUrl("/sitemap.xml", baseUrl)],
    host: baseUrl,
  };
}
