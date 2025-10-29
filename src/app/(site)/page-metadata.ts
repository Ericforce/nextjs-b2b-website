import type { Metadata } from "next";
import { fetchPageBySlug, fetchSiteSettings } from "@/lib/sanity/api/page";

export async function buildMetadataForSlug(slug: string): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    fetchPageBySlug(slug),
    fetchSiteSettings(),
  ]);

  const title =
    page?.seo?.title ||
    page?.title ||
    settings?.seo?.title ||
    settings?.title ||
    "Next.js B2B Application";

  const description =
    page?.seo?.description ||
    settings?.seo?.description ||
    settings?.description ||
    "A modern B2B application built with Next.js 14";

  return {
    title,
    description,
    keywords: page?.seo?.keywords || settings?.seo?.keywords,
    robots: {
      index: page?.seo?.noindex ? false : !settings?.seo?.noindex,
      follow: page?.seo?.nofollow ? false : !settings?.seo?.nofollow,
    },
  };
}
