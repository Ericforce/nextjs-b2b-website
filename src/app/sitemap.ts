import type { MetadataRoute } from "next";

import { ROUTES } from "@/lib/constants";
import { getAllBlogPosts, getAllPages, getSiteSettings } from "@/lib/sanity";
import { absoluteUrl, getSiteBaseUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [siteSettings, pages, posts] = await Promise.all([
    getSiteSettings(),
    getAllPages(),
    getAllBlogPosts(),
  ]);

  const baseUrl = getSiteBaseUrl(siteSettings);

  const pagePaths = new Set(
    pages.map((page) => normalizePath(page.seo?.canonical ?? `/${page.slug}`))
  );
  const postPaths = new Set(
    posts.map((post) =>
      normalizePath(post.seo?.canonical ?? `/blog/${post.slug}`)
    )
  );

  const staticRoutes = Array.from(
    new Set(["/", ...Object.values(ROUTES), "/blog"])
  )
    .map((route) => normalizePath(route))
    .filter((route) => !pagePaths.has(route) && !postPaths.has(route));

  const staticEntries = staticRoutes.map((route) => ({
    url: absoluteUrl(route, baseUrl),
    lastModified: siteSettings.updatedAt,
  }));

  const pageEntries = pages.map((page) => ({
    url: absoluteUrl(page.seo?.canonical ?? `/${page.slug}`, baseUrl),
    lastModified: page.updatedAt,
  }));

  const postEntries = posts.map((post) => ({
    url: absoluteUrl(post.seo?.canonical ?? `/blog/${post.slug}`, baseUrl),
    lastModified: post.updatedAt ?? post.publishedAt,
  }));

  return [...staticEntries, ...pageEntries, ...postEntries];
}

function normalizePath(path: string) {
  try {
    const url = new URL(path);
    return url.pathname === "" ? "/" : url.pathname;
  } catch {
    if (!path.startsWith("/")) {
      return `/${path}`;
    }

    return path;
  }
}
