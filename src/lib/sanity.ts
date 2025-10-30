import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";

import { client, previewClient } from "@/lib/sanity";
import {
  allAuthorsQuery,
  allBlogPostsQuery,
  allCategoriesQuery,
  allPagesQuery,
  allTagsQuery,
  authorBySlugQuery,
  blogFiltersQuery,
  blogPostBySlugQuery,
  blogPostSlugsQuery,
  blogPostsPaginatedQuery,
  categoryBySlugQuery,
  pageBySlugQuery,
  reusableSectionsQuery,
  siteSettingsQuery,
  tagBySlugQuery,
} from "@/lib/sanity/queries";
import type {
  AuthorDocument,
  BlogPostDocument,
  CategoryDocument,
  PageDocument,
  ReusableSection,
  SanityImageAsset,
  SeoFields,
  SiteSettings,
  SiteSocialLinks,
  TagDocument,
} from "@/types";

const DEFAULT_REVALIDATE = 60;

const BLOG_POSTS_TAG = "sanity-blog-posts";
const BLOG_FILTERS_TAG = "sanity-blog-filters";
const BLOG_TAXONOMIES_TAG = "sanity-blog-taxonomies";

export const DEFAULT_BLOG_PAGE_SIZE = 9;

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

type Maybe<T> = T | null | undefined;

interface SanityAuthorInput extends Partial<AuthorDocument> {
  socialLinks?: SiteSocialLinks;
}

interface SanityCategoryInput extends Partial<CategoryDocument> {}

interface SanityTagInput extends Partial<TagDocument> {}

interface SanityBlogPostInput extends Partial<BlogPostDocument> {
  body?: unknown;
  author?: Maybe<SanityAuthorInput>;
  categories?: Maybe<SanityCategoryInput[]>;
  tags?: Maybe<SanityTagInput[]>;
}

interface BlogFiltersQueryResult {
  categories: Maybe<SanityCategoryInput[]>;
  tags: Maybe<SanityTagInput[]>;
  authors: Maybe<SanityAuthorInput[]>;
}

interface BlogPostsPaginatedQueryResult {
  items: SanityBlogPostInput[];
  total: number;
}

export interface BlogPostListParams {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  author?: string;
}

export interface BlogPostListResult {
  items: BlogPostDocument[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BlogFiltersResult {
  categories: CategoryDocument[];
  tags: TagDocument[];
  authors: AuthorDocument[];
}

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

const TITLE_COLLATOR = new Intl.Collator("en", { sensitivity: "base" });

function normalizeSlug(value?: Maybe<string>): string {
  if (!value) {
    return "";
  }

  return value.toString().trim().replace(/^\/+|\/+$/g, "");
}

function normalizeImage(
  image?: Maybe<SanityImageAsset>
): SanityImageAsset | undefined {
  if (!image?.url) {
    return undefined;
  }

  return {
    url: image.url,
    width: image.width,
    height: image.height,
    alt: image.alt ?? undefined,
  };
}

function normalizeSocialLinks(
  input?: Maybe<SiteSocialLinks>
): SiteSocialLinks | undefined {
  if (!input) {
    return undefined;
  }

  const entries = Object.entries(input).filter(
    ([, value]) => typeof value === "string" && value.trim().length > 0
  );

  if (entries.length === 0) {
    return undefined;
  }

  const social = entries.reduce<Partial<SiteSocialLinks>>((acc, [key, value]) => {
    acc[key as keyof SiteSocialLinks] = value.trim();
    return acc;
  }, {});

  return social as SiteSocialLinks;
}

function normalizeAuthor(author?: Maybe<SanityAuthorInput>): AuthorDocument | null {
  if (!author?._id) {
    return null;
  }

  const slug = normalizeSlug(author.slug);
  const resolvedSlug = slug || author._id;
  if (!resolvedSlug) {
    return null;
  }

  const name = author.name?.trim() ?? "Unknown author";

  return {
    _id: author._id,
    _type: author._type ?? "author",
    slug: resolvedSlug,
    name,
    bio: author.bio?.trim() || undefined,
    role: author.role?.trim() || undefined,
    image: normalizeImage(author.image),
    website: author.website?.trim() || undefined,
    email: author.email?.trim() || undefined,
    social: normalizeSocialLinks(author.social ?? author.socialLinks),
    _updatedAt: author._updatedAt,
  };
}

function normalizeCategory(
  category?: Maybe<SanityCategoryInput>
): CategoryDocument | null {
  if (!category?._id) {
    return null;
  }

  const slug = normalizeSlug(category.slug);
  if (!slug) {
    return null;
  }

  return {
    _id: category._id,
    _type: category._type ?? "category",
    slug,
    title: category.title?.trim() || slug,
    description: category.description?.trim() || undefined,
    color: category.color?.trim() || undefined,
    icon: category.icon?.trim() || undefined,
    postCount:
      typeof category.postCount === "number" ? category.postCount : undefined,
    _updatedAt: category._updatedAt,
  };
}

function normalizeTag(tag?: Maybe<SanityTagInput>): TagDocument | null {
  if (!tag?._id) {
    return null;
  }

  const slug = normalizeSlug(tag.slug);
  if (!slug) {
    return null;
  }

  return {
    _id: tag._id,
    _type: tag._type ?? "tag",
    slug,
    title: tag.title?.trim() || slug,
    description: tag.description?.trim() || undefined,
    color: tag.color?.trim() || undefined,
    postCount: typeof tag.postCount === "number" ? tag.postCount : undefined,
    _updatedAt: tag._updatedAt,
  };
}

function sortByTitle<T extends { title?: string }>(a: T, b: T) {
  return TITLE_COLLATOR.compare(a.title ?? "", b.title ?? "");
}

function sortByName<T extends { name?: string }>(a: T, b: T) {
  return TITLE_COLLATOR.compare(a.name ?? "", b.name ?? "");
}

function normalizeBlogPost(
  post?: Maybe<SanityBlogPostInput>
): BlogPostDocument | null {
  if (!post?._id) {
    return null;
  }

  const slug = normalizeSlug(post.slug);
  if (!slug) {
    return null;
  }

  const categories = Array.isArray(post.categories)
    ? post.categories
        .map((category) => normalizeCategory(category))
        .filter((category): category is CategoryDocument => Boolean(category))
        .sort(sortByTitle)
    : [];

  const tags = Array.isArray(post.tags)
    ? post.tags
        .map((tag) => normalizeTag(tag))
        .filter((tag): tag is TagDocument => Boolean(tag))
        .sort(sortByTitle)
    : [];

  const author = normalizeAuthor(post.author);

  const readingTime = (() => {
    if (typeof post?.readingTime === "number") {
      return `${post.readingTime} min read`;
    }

    if (typeof post?.readingTime === "string") {
      const trimmed = post.readingTime.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }

    return undefined;
  })();

  const publishedAt = post?.publishedAt ?? post?.createdAt ?? post?.updatedAt;
  const createdAt = post?.createdAt ?? post?.publishedAt ?? post?.updatedAt;
  const updatedAt = post?.updatedAt ?? post?.publishedAt ?? post?.createdAt;

  return {
    _id: post._id,
    _type: post._type ?? "blogPost",
    slug,
    title: post.title?.trim() || slug,
    excerpt: post.excerpt?.trim() || undefined,
    featuredImage: normalizeImage(post.featuredImage),
    body: Array.isArray(post.body)
      ? (post.body as BlogPostDocument["body"])
      : undefined,
    author: author,
    categories,
    tags,
    readingTime,
    publishedAt: publishedAt ?? undefined,
    createdAt: createdAt ?? undefined,
    updatedAt: updatedAt ?? undefined,
    seo: fallbackSeo(post.seo),
  };
}

function sortPostsByDateDescending(a: BlogPostDocument, b: BlogPostDocument) {
  const toTimestamp = (value?: string) =>
    value ? new Date(value).getTime() : 0;

  const aTimestamp = toTimestamp(a.updatedAt ?? a.publishedAt ?? a.createdAt);
  const bTimestamp = toTimestamp(b.updatedAt ?? b.publishedAt ?? b.createdAt);

  return bTimestamp - aTimestamp;
}

function mapBlogPosts(
  posts?: Maybe<SanityBlogPostInput[]>
): BlogPostDocument[] {
  return (posts ?? [])
    .map((post) => normalizeBlogPost(post))
    .filter((post): post is BlogPostDocument => Boolean(post))
    .sort(sortPostsByDateDescending);
}

export const DEFAULT_SANITY_REVALIDATE = DEFAULT_REVALIDATE;

const getCachedAllBlogPosts = unstable_cache(
  async () => client.fetch<SanityBlogPostInput[]>(allBlogPostsQuery),
  ["sanity-blog-posts-all"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [BLOG_POSTS_TAG],
  }
);

const getCachedBlogPostsPaginated = unstable_cache(
  async (params: {
    category?: string;
    tag?: string;
    author?: string;
    start: number;
    end: number;
  }) =>
    client.fetch<BlogPostsPaginatedQueryResult>(blogPostsPaginatedQuery, params),
  ["sanity-blog-posts-paginated"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [BLOG_POSTS_TAG],
  }
);

const getCachedBlogPostBySlug = unstable_cache(
  async (slug: string) =>
    client.fetch<SanityBlogPostInput | null>(blogPostBySlugQuery, { slug }),
  ["sanity-blog-post-by-slug"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [BLOG_POSTS_TAG],
  }
);

const getCachedBlogPostSlugs = unstable_cache(
  async () => client.fetch<{ slug: string }[]>(blogPostSlugsQuery),
  ["sanity-blog-post-slugs"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [BLOG_POSTS_TAG],
  }
);

const getCachedBlogFilters = unstable_cache(
  async () => client.fetch<BlogFiltersQueryResult>(blogFiltersQuery),
  ["sanity-blog-filters"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [BLOG_FILTERS_TAG, BLOG_TAXONOMIES_TAG, BLOG_POSTS_TAG],
  }
);

const getCachedAllAuthors = unstable_cache(
  async () => client.fetch<SanityAuthorInput[]>(allAuthorsQuery),
  ["sanity-blog-authors"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [BLOG_FILTERS_TAG, BLOG_TAXONOMIES_TAG],
  }
);

const getCachedAllCategories = unstable_cache(
  async () => client.fetch<SanityCategoryInput[]>(allCategoriesQuery),
  ["sanity-blog-categories"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [BLOG_TAXONOMIES_TAG],
  }
);

const getCachedAllTags = unstable_cache(
  async () => client.fetch<SanityTagInput[]>(allTagsQuery),
  ["sanity-blog-tags"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [BLOG_TAXONOMIES_TAG],
  }
);

const getCachedAuthorBySlug = unstable_cache(
  async (slug: string) =>
    client.fetch<SanityAuthorInput | null>(authorBySlugQuery, { slug }),
  ["sanity-blog-author-by-slug"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [BLOG_FILTERS_TAG, BLOG_TAXONOMIES_TAG],
  }
);

const getCachedCategoryBySlug = unstable_cache(
  async (slug: string) =>
    client.fetch<SanityCategoryInput | null>(categoryBySlugQuery, { slug }),
  ["sanity-blog-category-by-slug"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [BLOG_TAXONOMIES_TAG],
  }
);

const getCachedTagBySlug = unstable_cache(
  async (slug: string) =>
    client.fetch<SanityTagInput | null>(tagBySlugQuery, { slug }),
  ["sanity-blog-tag-by-slug"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [BLOG_TAXONOMIES_TAG],
  }
);

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

export async function getAllBlogPosts(): Promise<BlogPostDocument[]> {
  const { isEnabled } = draftMode();

  if (isEnabled) {
    const posts = await safeFetch(() =>
      previewClient.fetch<SanityBlogPostInput[]>(allBlogPostsQuery)
    );
    return mapBlogPosts(posts ?? []);
  }

  const posts = await safeFetch(() => getCachedAllBlogPosts());
  return mapBlogPosts(posts ?? []);
}

export async function getAllBlogPostSlugs(): Promise<string[]> {
  const { isEnabled } = draftMode();

  if (isEnabled) {
    const slugs = await safeFetch(() =>
      previewClient.fetch<{ slug: string }[]>(blogPostSlugsQuery)
    );
    return (slugs ?? [])
      .map((entry) => normalizeSlug(entry.slug))
      .filter((slug) => slug.length > 0);
  }

  const slugs = await safeFetch(() => getCachedBlogPostSlugs());
  return (slugs ?? [])
    .map((entry) => normalizeSlug(entry.slug))
    .filter((slug) => slug.length > 0);
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostDocument | null> {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  const { isEnabled } = draftMode();

  if (isEnabled) {
    const post = await safeFetch(() =>
      previewClient.fetch<SanityBlogPostInput | null>(blogPostBySlugQuery, {
        slug: normalizedSlug,
      })
    );

    return normalizeBlogPost(post ?? undefined);
  }

  const post = await safeFetch(() => getCachedBlogPostBySlug(normalizedSlug));
  return normalizeBlogPost(post ?? undefined);
}

export async function getPaginatedBlogPosts(
  params: BlogPostListParams = {}
): Promise<BlogPostListResult> {
  const pageSize = Math.max(1, params.pageSize ?? DEFAULT_BLOG_PAGE_SIZE);
  const page = Math.max(1, params.page ?? 1);

  const category = normalizeSlug(params.category);
  const tag = normalizeSlug(params.tag);
  const author = normalizeSlug(params.author);

  const queryParams = {
    category: category || undefined,
    tag: tag || undefined,
    author: author || undefined,
    start: (page - 1) * pageSize,
    end: (page - 1) * pageSize + pageSize - 1,
  } as const;

  const { isEnabled } = draftMode();

  const result = await safeFetch(() =>
    isEnabled
      ? previewClient.fetch<BlogPostsPaginatedQueryResult>(
          blogPostsPaginatedQuery,
          queryParams
        )
      : getCachedBlogPostsPaginated({ ...queryParams })
  );

  const items = mapBlogPosts(result?.items);
  const total = result?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return {
    items,
    total,
    page,
    pageSize,
    pageCount,
    hasNextPage: page < pageCount,
    hasPreviousPage: page > 1,
  };
}

export async function getBlogFilters(): Promise<BlogFiltersResult> {
  const { isEnabled } = draftMode();

  const filters = await safeFetch(() =>
    isEnabled
      ? previewClient.fetch<BlogFiltersQueryResult>(blogFiltersQuery)
      : getCachedBlogFilters()
  );

  const categories = (filters?.categories ?? [])
    .map((category) => normalizeCategory(category))
    .filter((category): category is CategoryDocument => Boolean(category))
    .sort(sortByTitle);

  const tags = (filters?.tags ?? [])
    .map((tag) => normalizeTag(tag))
    .filter((tag): tag is TagDocument => Boolean(tag))
    .sort(sortByTitle);

  const authors = (filters?.authors ?? [])
    .map((author) => normalizeAuthor(author))
    .filter((author): author is AuthorDocument => Boolean(author))
    .sort(sortByName);

  return {
    categories,
    tags,
    authors,
  };
}

export async function getAllBlogCategories(): Promise<CategoryDocument[]> {
  const { isEnabled } = draftMode();

  if (isEnabled) {
    const categories = await safeFetch(() =>
      previewClient.fetch<SanityCategoryInput[]>(allCategoriesQuery)
    );
    return (categories ?? [])
      .map((category) => normalizeCategory(category))
      .filter((category): category is CategoryDocument => Boolean(category))
      .sort(sortByTitle);
  }

  const categories = await safeFetch(() => getCachedAllCategories());
  return (categories ?? [])
    .map((category) => normalizeCategory(category))
    .filter((category): category is CategoryDocument => Boolean(category))
    .sort(sortByTitle);
}

export async function getAllBlogTags(): Promise<TagDocument[]> {
  const { isEnabled } = draftMode();

  if (isEnabled) {
    const tags = await safeFetch(() =>
      previewClient.fetch<SanityTagInput[]>(allTagsQuery)
    );
    return (tags ?? [])
      .map((tag) => normalizeTag(tag))
      .filter((tag): tag is TagDocument => Boolean(tag))
      .sort(sortByTitle);
  }

  const tags = await safeFetch(() => getCachedAllTags());
  return (tags ?? [])
    .map((tag) => normalizeTag(tag))
    .filter((tag): tag is TagDocument => Boolean(tag))
    .sort(sortByTitle);
}

export async function getAllBlogAuthors(): Promise<AuthorDocument[]> {
  const { isEnabled } = draftMode();

  if (isEnabled) {
    const authors = await safeFetch(() =>
      previewClient.fetch<SanityAuthorInput[]>(allAuthorsQuery)
    );
    return (authors ?? [])
      .map((author) => normalizeAuthor(author))
      .filter((author): author is AuthorDocument => Boolean(author))
      .sort(sortByName);
  }

  const authors = await safeFetch(() => getCachedAllAuthors());
  return (authors ?? [])
    .map((author) => normalizeAuthor(author))
    .filter((author): author is AuthorDocument => Boolean(author))
    .sort(sortByName);
}

export async function getBlogCategoryBySlug(
  slug: string
): Promise<CategoryDocument | null> {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  const { isEnabled } = draftMode();

  if (isEnabled) {
    const category = await safeFetch(() =>
      previewClient.fetch<SanityCategoryInput | null>(categoryBySlugQuery, {
        slug: normalizedSlug,
      })
    );

    return normalizeCategory(category ?? undefined);
  }

  const category = await safeFetch(() => getCachedCategoryBySlug(normalizedSlug));
  return normalizeCategory(category ?? undefined);
}

export async function getBlogTagBySlug(
  slug: string
): Promise<TagDocument | null> {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  const { isEnabled } = draftMode();

  if (isEnabled) {
    const tag = await safeFetch(() =>
      previewClient.fetch<SanityTagInput | null>(tagBySlugQuery, {
        slug: normalizedSlug,
      })
    );

    return normalizeTag(tag ?? undefined);
  }

  const tag = await safeFetch(() => getCachedTagBySlug(normalizedSlug));
  return normalizeTag(tag ?? undefined);
}

export async function getBlogAuthorBySlug(
  slug: string
): Promise<AuthorDocument | null> {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  const { isEnabled } = draftMode();

  if (isEnabled) {
    const author = await safeFetch(() =>
      previewClient.fetch<SanityAuthorInput | null>(authorBySlugQuery, {
        slug: normalizedSlug,
      })
    );

    return normalizeAuthor(author ?? undefined);
  }

  const author = await safeFetch(() => getCachedAuthorBySlug(normalizedSlug));
  return normalizeAuthor(author ?? undefined);
}
