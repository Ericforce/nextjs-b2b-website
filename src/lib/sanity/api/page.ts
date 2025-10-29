import { getClient } from "@/lib/sanity/config";
import {
  pageBySlugQuery,
  pagePathsQuery,
  reusableSectionBySlugQuery,
  reusableSectionsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries/pages";
import type {
  SanityPage,
  SanityReusableSection,
  SanitySiteSettings,
} from "@/types/sanity";
import { fallbackPageData } from "@/data/fallback-pages";
import {
  fallbackReusableSections,
  fallbackSiteSettings,
} from "@/data/site-settings";

function clone<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function mergeWithFallback<T extends object>(
  fallbackValue: T,
  value: T | null | undefined
): T {
  if (!value) {
    return clone(fallbackValue);
  }

  return {
    ...clone(fallbackValue),
    ...clone(value),
  };
}

export async function fetchPageBySlug(
  slug: string,
  preview: boolean = false
): Promise<SanityPage | null> {
  if (!slug) {
    return null;
  }

  try {
    const client = getClient(preview);
    const page = await client.fetch<SanityPage | null>(pageBySlugQuery, {
      slug,
    });

    if (page) {
      const fallbackPage = fallbackPageData[slug];

      if (!page.sections?.length && fallbackPage?.sections?.length) {
        return {
          ...page,
          sections: clone(fallbackPage.sections),
        };
      }

      return page;
    }
  } catch (error) {
    console.warn("Failed to fetch page from Sanity", error);
  }

  const fallbackPage = fallbackPageData[slug];
  return fallbackPage ? clone(fallbackPage) : null;
}

export async function fetchPagePaths(): Promise<Array<{ slug: string }>> {
  const fallbackPaths = Object.keys(fallbackPageData).map((slug) => ({ slug }));

  try {
    const client = getClient(false);
    const paths = await client.fetch<Array<{ slug: string }>>(pagePathsQuery);

    if (!paths || paths.length === 0) {
      return fallbackPaths;
    }

    const merged = new Map<string, { slug: string }>();
    [...paths, ...fallbackPaths].forEach(({ slug }) => {
      if (slug) {
        merged.set(slug, { slug });
      }
    });

    return Array.from(merged.values());
  } catch (error) {
    console.warn("Failed to fetch page paths from Sanity", error);
    return fallbackPaths;
  }
}

export async function fetchSiteSettings(
  preview: boolean = false
): Promise<SanitySiteSettings> {
  try {
    const client = getClient(preview);
    const settings = await client.fetch<SanitySiteSettings | null>(
      siteSettingsQuery
    );

    return mergeWithFallback(fallbackSiteSettings, settings ?? undefined);
  } catch (error) {
    console.warn("Failed to fetch site settings from Sanity", error);
    return clone(fallbackSiteSettings);
  }
}

export async function fetchReusableSections(
  preview: boolean = false
): Promise<Record<string, SanityReusableSection>> {
  try {
    const client = getClient(preview);
    const sections = await client.fetch<SanityReusableSection[]>(
      reusableSectionsQuery
    );

    if (!sections?.length) {
      return clone(fallbackReusableSections);
    }

    return sections.reduce<Record<string, SanityReusableSection>>(
      (acc, section) => {
        if (section.slug) {
          acc[section.slug] = section;
        }
        return acc;
      },
      {}
    );
  } catch (error) {
    console.warn("Failed to fetch reusable sections from Sanity", error);
    return clone(fallbackReusableSections);
  }
}

export async function fetchReusableSection(
  slug: string,
  preview: boolean = false
): Promise<SanityReusableSection | null> {
  if (!slug) {
    return null;
  }

  try {
    const client = getClient(preview);
    const section = await client.fetch<SanityReusableSection | null>(
      reusableSectionBySlugQuery,
      { slug }
    );

    if (section) {
      return section;
    }
  } catch (error) {
    console.warn("Failed to fetch reusable section from Sanity", error);
  }

  return fallbackReusableSections[slug]
    ? clone(fallbackReusableSections[slug])
    : null;
}
