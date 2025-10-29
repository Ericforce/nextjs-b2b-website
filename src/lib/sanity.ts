import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";

import { client, previewClient } from "@/lib/sanity";
import { posts } from "@/data/posts";
import {
  allPagesQuery,
  pageBySlugQuery,
  reusableSectionsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import type {
  BlogPostDocument,
  PageDocument,
  ReusableSection,
  SeoFields,
  SiteSettings,
} from "@/types";

const DEFAULT_REVALIDATE = 60;

const getCachedSiteSettings = unstable_cache(
  async () => client.fetch<SiteSettings | null>(siteSettingsQuery),
  ["sanity-site-settings"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: ["sanity-site-settings"],
  }
);

const getCachedPages = unstable_cache(
  async () => client.fetch<PageDocument[]>(allPagesQuery),
  ["sanity-pages"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: ["sanity-pages"],
  }
);

const getCachedPageBySlug = unstable_cache(
  async (slug: string) =>
    client.fetch<PageDocument | null>(pageBySlugQuery, { slug }),
  ["sanity-page-by-slug"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: ["sanity-pages"],
  }
);

const getCachedReusableSections = unstable_cache(
  async () => client.fetch<ReusableSection[]>(reusableSectionsQuery),
  ["sanity-reusable-sections"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: ["sanity-reusable-sections"],
  }
);

function safeConsoleWarn(message: string, error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(message, error);
  }
}

async function safeFetch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    safeConsoleWarn("Sanity fetch failed", error);
    return null;
  }
}

function fallbackSeo(data?: SeoFields | null): SeoFields {
  return {
    title: data?.title,
    description: data?.description,
    titleTemplate: data?.titleTemplate,
    canonical: data?.canonical,
    noIndex: data?.noIndex,
    keywords: data?.keywords,
    ogTitle: data?.ogTitle,
    ogDescription: data?.ogDescription,
    twitterTitle: data?.twitterTitle,
    twitterDescription: data?.twitterDescription,
    ogImage: data?.ogImage,
    twitterImage: data?.twitterImage,
  };
}

function normalizeSiteSettings(input?: SiteSettings | null): SiteSettings {
  const updatedAt = input?.updatedAt ?? new Date().toISOString();

  return {
    siteName: input?.siteName ?? "Website",
    description: input?.description ?? "",
    locale: input?.locale ?? "en_US",
    siteUrl: input?.siteUrl ?? "",
    email: input?.email,
    logo: input?.logo,
    favicon: input?.favicon,
    updatedAt,
    defaultSeo: fallbackSeo(input?.defaultSeo),
    navigation: {
      main: input?.navigation?.main ?? [],
      secondary: input?.navigation?.secondary ?? [],
    },
    footerSections: input?.footerSections ?? [],
    social: input?.social ?? {},
    headerCta: input?.headerCta ?? null,
    copyrightText: input?.copyrightText,
  };
}

function normalizePage(page?: PageDocument | null): PageDocument | null {
  if (!page) {
    return null;
  }

  return {
    ...page,
    description: page.description ?? "",
    sections: page.sections ?? [],
    createdAt: page.createdAt ?? page.updatedAt ?? new Date().toISOString(),
    updatedAt: page.updatedAt ?? page.createdAt ?? new Date().toISOString(),
    seo: fallbackSeo(page.seo),
  };
}

function normalizeReusableSections(
  sections?: ReusableSection[] | null
): ReusableSection[] {
  if (!sections) {
    return [];
  }

  return sections.map((section) => ({
    ...section,
    sections: section.sections ?? [],
  }));
}

export const DEFAULT_SANITY_REVALIDATE = DEFAULT_REVALIDATE;

export async function getSiteSettings(): Promise<SiteSettings> {
  const { isEnabled } = draftMode();

  if (isEnabled) {
    const settings = await safeFetch(() =>
      previewClient.fetch<SiteSettings | null>(siteSettingsQuery)
    );
    return normalizeSiteSettings(settings ?? undefined);
  }

  const settings = await safeFetch(() => getCachedSiteSettings());
  return normalizeSiteSettings(settings ?? undefined);
}

export async function getAllPages(): Promise<PageDocument[]> {
  const { isEnabled } = draftMode();

  if (isEnabled) {
    const pages = await safeFetch(() =>
      previewClient.fetch<PageDocument[]>(allPagesQuery)
    );

    return (pages ?? [])
      .map((page) => normalizePage(page))
      .filter((page): page is PageDocument => Boolean(page));
  }

  const pages = await safeFetch(() => getCachedPages());

  return (pages ?? [])
    .map((page) => normalizePage(page))
    .filter((page): page is PageDocument => Boolean(page));
}

export async function getPageBySlug(
  slug: string
): Promise<PageDocument | null> {
  const normalizedSlug = slug.trim();
  const { isEnabled } = draftMode();

  if (!normalizedSlug) {
    return null;
  }

  if (isEnabled) {
    const page = await safeFetch(() =>
      previewClient.fetch<PageDocument | null>(pageBySlugQuery, {
        slug: normalizedSlug,
      })
    );

    return normalizePage(page);
  }

  const page = await safeFetch(() => getCachedPageBySlug(normalizedSlug));
  return normalizePage(page ?? undefined);
}

export async function getReusableSections(): Promise<ReusableSection[]> {
  const { isEnabled } = draftMode();

  if (isEnabled) {
    const sections = await safeFetch(() =>
      previewClient.fetch<ReusableSection[]>(reusableSectionsQuery)
    );

    return normalizeReusableSections(sections);
  }

  const sections = await safeFetch(() => getCachedReusableSections());
  return normalizeReusableSections(sections);
}

export const getAllBlogPosts = async (): Promise<BlogPostDocument[]> => {
  return posts;
};

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostDocument | undefined> {
  const allPosts = await getAllBlogPosts();
  return allPosts.find((post) => post.slug === slug);
}
