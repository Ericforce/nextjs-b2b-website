import { cache } from "react";

import { pages } from "@/data/pages";
import { siteSettings } from "@/data/siteSettings";
import type { PageDocument, SiteSettings } from "@/types";

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return siteSettings;
});

export const getAllPages = cache(async (): Promise<PageDocument[]> => {
  return pages;
});

export async function getPageBySlug(
  slug: string
): Promise<PageDocument | undefined> {
  const allPages = await getAllPages();
  return allPages.find((page) => page.slug === slug);
}
