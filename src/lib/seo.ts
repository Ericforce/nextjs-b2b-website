import type { Metadata } from "next";
import { cache } from "react";

import { env } from "@/lib/env";
import { getSiteSettings } from "@/lib/sanity";
import type {
  BlogPost,
  PageDocument,
  SeoFields,
  SeoImage,
  SiteSettings,
} from "@/types";

interface MetadataDefaults {
  siteSettings: SiteSettings;
  metadata: Metadata;
}

const OG_DEFAULT_WIDTH = 1200;
const OG_DEFAULT_HEIGHT = 630;

const buildDefaults = cache(async (): Promise<MetadataDefaults> => {
  const siteSettings = await getSiteSettings();
  const baseUrl = getSiteBaseUrl(siteSettings);
  const defaultTitle = siteSettings.defaultSeo.title ?? siteSettings.siteName;
  const description =
    siteSettings.defaultSeo.description ?? siteSettings.description;

  const ogImage = resolveOpenGraphImage(
    siteSettings.defaultSeo.ogImage,
    siteSettings.defaultSeo.ogTitle ?? defaultTitle,
    baseUrl
  );

  const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
      default: defaultTitle,
      template:
        siteSettings.defaultSeo.titleTemplate ??
        `%s | ${siteSettings.siteName}`,
    },
    description,
    alternates: {
      canonical: absoluteUrl("/", baseUrl),
    },
    openGraph: {
      type: "website",
      locale: siteSettings.locale,
      siteName: siteSettings.siteName,
      url: baseUrl,
      title: siteSettings.defaultSeo.ogTitle ?? defaultTitle,
      description: siteSettings.defaultSeo.ogDescription ?? description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      site: formatTwitterHandle(siteSettings.social?.twitter),
      title: siteSettings.defaultSeo.twitterTitle ?? defaultTitle,
      description: siteSettings.defaultSeo.twitterDescription ?? description,
      images: [
        absoluteUrl(
          siteSettings.defaultSeo.twitterImage?.url ?? ogImage.url,
          baseUrl
        ),
      ],
    },
    icons: {
      icon: siteSettings.favicon ?? "/favicon.ico",
    },
  };

  return {
    siteSettings,
    metadata,
  };
});

export const getMetadataDefaults = async (): Promise<MetadataDefaults> =>
  buildDefaults();

export interface GeneratePageMetadataInput {
  title?: string;
  description?: string;
  seo?: SeoFields;
  canonicalPath?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export async function generatePageMetadata(
  input: GeneratePageMetadataInput
): Promise<Metadata> {
  const { metadata: defaults, siteSettings } = await getMetadataDefaults();
  const baseUrl = getSiteBaseUrl(siteSettings);

  const overriddenTitle = input.seo?.title ?? input.title;
  const baseTitle =
    typeof defaults.title === "string"
      ? defaults.title
      : (defaults.title?.default ?? siteSettings.siteName);
  const title = overriddenTitle ?? baseTitle;

  const description =
    input.seo?.description ?? input.description ?? defaults.description;

  const canonical = absoluteUrl(
    input.seo?.canonical ?? input.canonicalPath ?? "/",
    baseUrl
  );

  const openGraphImage = resolveOpenGraphImage(
    input.seo?.ogImage ?? siteSettings.defaultSeo.ogImage,
    input.seo?.ogTitle ?? title,
    baseUrl
  );

  const twitterImage = absoluteUrl(
    input.seo?.twitterImage?.url ?? openGraphImage.url,
    baseUrl
  );

  const mergedOpenGraph = {
    ...(defaults.openGraph ?? {}),
    type: input.type ?? defaults.openGraph?.type ?? "website",
    url: canonical,
    title: input.seo?.ogTitle ?? title,
    description: input.seo?.ogDescription ?? description,
    images: [openGraphImage],
    publishedTime: input.publishedTime,
    modifiedTime:
      input.modifiedTime ?? input.publishedTime ?? siteSettings.updatedAt,
    authors: input.authors,
  } satisfies NonNullable<Metadata["openGraph"]>;

  const mergedTwitter = {
    ...(defaults.twitter ?? {}),
    title: input.seo?.twitterTitle ?? title,
    description: input.seo?.twitterDescription ?? description,
    images: [twitterImage],
  } satisfies NonNullable<Metadata["twitter"]>;

  const robots = input.seo?.noIndex
    ? {
        index: false,
        follow: false,
      }
    : undefined;

  const metadata: Metadata = {
    title,
    description: description ?? undefined,
    keywords: input.seo?.keywords,
    alternates: {
      canonical,
    },
    openGraph: mergedOpenGraph,
    twitter: mergedTwitter,
    robots,
  };

  return metadata;
}

export function buildHomePageJsonLd(site: SiteSettings) {
  const baseUrl = getSiteBaseUrl(site);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.siteName,
    url: baseUrl,
    description: site.description,
    inLanguage: site.locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildWebPageJsonLd(
  page: PageDocument,
  canonicalUrl: string,
  site: SiteSettings
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.seo?.description ?? page.description,
    url: canonicalUrl,
    datePublished: page.createdAt,
    dateModified: page.updatedAt,
    isPartOf: {
      "@type": "WebSite",
      name: site.siteName,
      url: getSiteBaseUrl(site),
    },
    inLanguage: site.locale,
  };
}

export function buildArticleJsonLd(
  post: BlogPost,
  canonicalUrl: string,
  site: SiteSettings
) {
  const baseUrl = getSiteBaseUrl(site);
  const primaryImageUrl =
    post.seo?.ogImage?.url ?? post.mainImageUrl ?? site.defaultSeo.ogImage?.url;
  const imageUrl = primaryImageUrl
    ? absoluteUrl(primaryImageUrl, baseUrl)
    : undefined;

  const authorUrl =
    post.author?.social?.website ??
    post.author?.social?.linkedin ??
    post.author?.social?.twitter ??
    post.author?.social?.github;

  const tagKeywords =
    post.tags
      ?.map((tag) => tag?.title)
      .filter((value): value is string => Boolean(value)) ?? [];

  const seoKeywords =
    post.seo?.keywords?.filter((keyword): keyword is string => Boolean(keyword)) ??
    [];

  const keywords =
    seoKeywords.length > 0
      ? seoKeywords
      : tagKeywords.length > 0
        ? tagKeywords
        : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo?.description ?? post.excerpt,
    url: canonicalUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          ...(post.author.title ? { jobTitle: post.author.title } : {}),
          ...(authorUrl ? { url: authorUrl } : {}),
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: site.siteName,
      logo: site.logo
        ? {
            "@type": "ImageObject",
            url: absoluteUrl(site.logo, baseUrl),
          }
        : undefined,
    },
    image: imageUrl ? [imageUrl] : undefined,
    keywords,
    inLanguage: site.locale,
  };
}

export function jsonLdScriptProps(id: string, data: unknown) {
  const json = JSON.stringify(data, null, 2)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return {
    id,
    type: "application/ld+json",
    strategy: "afterInteractive" as const,
    dangerouslySetInnerHTML: {
      __html: json,
    },
  };
}

export function buildOgImageUrl(params: {
  title: string;
  subtitle?: string;
  theme?: string;
}) {
  const baseUrl = env.app.url;
  const url = new URL("/og", baseUrl);
  url.searchParams.set("title", params.title);
  if (params.subtitle) {
    url.searchParams.set("subtitle", params.subtitle);
  }
  if (params.theme) {
    url.searchParams.set("theme", params.theme);
  }
  return url.toString();
}

export function absoluteUrl(
  path: string | URL | undefined,
  base?: string
): string {
  if (!path) {
    return base ?? env.app.url;
  }

  if (path instanceof URL) {
    return path.toString();
  }

  if (isAbsoluteUrl(path)) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, base ?? env.app.url).toString();
}

export function getSiteBaseUrl(site?: SiteSettings): string {
  if (site?.siteUrl && isAbsoluteUrl(site.siteUrl)) {
    return site.siteUrl;
  }

  return env.app.url;
}

function isAbsoluteUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function resolveOpenGraphImage(
  image: SeoImage | undefined,
  fallbackTitle: string,
  baseUrl: string
) {
  const fallbackUrl = buildOgImageUrl({ title: fallbackTitle });
  return {
    url: absoluteUrl(image?.url ?? fallbackUrl, baseUrl),
    width: image?.width ?? OG_DEFAULT_WIDTH,
    height: image?.height ?? OG_DEFAULT_HEIGHT,
    alt: image?.alt ?? fallbackTitle,
  };
}

function formatTwitterHandle(handle: string | undefined) {
  if (!handle) {
    return undefined;
  }

  if (handle.startsWith("@")) {
    return handle as `@${string}`;
  }

  return `@${handle}` as const;
}
