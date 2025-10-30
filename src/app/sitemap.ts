import type { MetadataRoute } from "next";

import { ROUTES } from "@/lib/constants";
import {
  getAllBlogAuthors,
  getAllBlogCategories,
  getAllBlogPosts,
  getAllBlogTags,
  getAllPages,
  getSiteSettings,
} from "@/lib/sanity";
import { absoluteUrl, getSiteBaseUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [siteSettings, pages, posts, categories, tags, authors] =
    await Promise.all([
      getSiteSettings(),
      getAllPages(),
      getAllBlogPosts(),
      getAllBlogCategories(),
      getAllBlogTags(),
      getAllBlogAuthors(),
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
  const categoryPaths = new Set(
    categories.map((category) =>
      normalizePath(`/blog/category/${category.slug}`)
    )
  );
  const tagPaths = new Set(
    tags.map((tag) => normalizePath(`/blog/tag/${tag.slug}`))
  );
  const authorPaths = new Set(
    authors.map((author) => normalizePath(`/blog/author/${author.slug}`))
  );

  const reservedPaths = new Set([
    ...pagePaths,
    ...postPaths,
    ...categoryPaths,
    ...tagPaths,
    ...authorPaths,
  ]);

  const staticRoutes = Array.from(
    new Set(["/", ...Object.values(ROUTES), "/blog"])
  )
    .map((route) => normalizePath(route))
    .filter((route) => !reservedPaths.has(route));

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

  const categoryEntries = categories.map((category) => ({
    url: absoluteUrl(`/blog/category/${category.slug}`, baseUrl),
    lastModified: category._updatedAt ?? siteSettings.updatedAt,
  }));

  const tagEntries = tags.map((tag) => ({
    url: absoluteUrl(`/blog/tag/${tag.slug}`, baseUrl),
    lastModified: tag._updatedAt ?? siteSettings.updatedAt,
  }));

  const authorEntries = authors.map((author) => ({
    url: absoluteUrl(`/blog/author/${author.slug}`, baseUrl),
    lastModified: author._updatedAt ?? siteSettings.updatedAt,
  }));

  return [
    ...staticEntries,
    ...pageEntries,
    ...postEntries,
    ...categoryEntries,
    ...tagEntries,
    ...authorEntries,
  ];
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
