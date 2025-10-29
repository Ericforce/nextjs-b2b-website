import { cache } from "react";

import { pages } from "@/data/pages";
import { posts } from "@/data/posts";
import { siteSettings } from "@/data/siteSettings";
import type { BlogPostDocument, PageDocument, SiteSettings } from "@/types";

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return siteSettings;
});

export const getAllPages = cache(async (): Promise<PageDocument[]> => {
  return pages;
});

export const getAllBlogPosts = cache(async (): Promise<BlogPostDocument[]> => {
  return posts;
});

export async function getPageBySlug(
  slug: string
): Promise<PageDocument | undefined> {
  const allPages = await getAllPages();
  return allPages.find((page) => page.slug === slug);
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostDocument | undefined> {
  const allPosts = await getAllBlogPosts();
  return allPosts.find((post) => post.slug === slug);
}
