import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";

import { BLOG_PAGE_SIZE } from "@/lib/constants";
import { client, previewClient } from "@/lib/sanity";
import {
  allPagesQuery,
  blogAuthorBySlugQuery,
  blogAuthorsQuery,
  blogCategoriesQuery,
  blogCategoryBySlugQuery,
  blogPostBySlugQuery,
  blogPostsQuery,
  blogTagBySlugQuery,
  blogTagsQuery,
  paginatedBlogPostsQuery,
  pageBySlugQuery,
  reusableSectionsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import type {
  BlogAuthor,
  BlogCategory,
  BlogPostDocument,
  BlogTag,
  PageDocument,
  PaginatedBlogPosts,
  ReusableSection,
  SanityImageAsset,
  SeoFields,
  SiteSettings,
} from "@/types";

const DEFAULT_REVALIDATE = 60;
const SANITY_BLOG_POST_TAG = "sanity-blog-posts";
const SANITY_BLOG_CATEGORY_TAG = "sanity-blog-categories";
const SANITY_BLOG_TAG_TAG = "sanity-blog-tags";
const SANITY_BLOG_AUTHOR_TAG = "sanity-blog-authors";

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

interface PaginatedBlogPostsQueryParams {
  start: number;
  end: number;
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  excludeSlug?: string;
}

interface PaginatedBlogPostsQueryResult {
  posts: BlogPostDocument[];
  total: number;
}

export interface BlogPostFilterParams {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  excludeSlug?: string;
}

const getCachedBlogPosts = unstable_cache(
  async () => client.fetch<BlogPostDocument[]>(blogPostsQuery),
  ["sanity-blog-posts"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [SANITY_BLOG_POST_TAG],
  }
);

const getCachedBlogPostBySlug = unstable_cache(
  async (slug: string) =>
    client.fetch<BlogPostDocument | null>(blogPostBySlugQuery, { slug }),
  ["sanity-blog-post-by-slug"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [SANITY_BLOG_POST_TAG],
  }
);

const getCachedPaginatedBlogPosts = unstable_cache(
  async (params: PaginatedBlogPostsQueryParams) =>
    client.fetch<PaginatedBlogPostsQueryResult>(paginatedBlogPostsQuery, params),
  ["sanity-blog-posts-paginated"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [SANITY_BLOG_POST_TAG],
  }
);

const getCachedBlogCategories = unstable_cache(
  async () => client.fetch<BlogCategory[]>(blogCategoriesQuery),
  ["sanity-blog-categories"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [SANITY_BLOG_CATEGORY_TAG],
  }
);

const getCachedBlogCategoryBySlug = unstable_cache(
  async (slug: string) =>
    client.fetch<BlogCategory | null>(blogCategoryBySlugQuery, { slug }),
  ["sanity-blog-category-by-slug"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [SANITY_BLOG_CATEGORY_TAG],
  }
);

const getCachedBlogTags = unstable_cache(
  async () => client.fetch<BlogTag[]>(blogTagsQuery),
  ["sanity-blog-tags"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [SANITY_BLOG_TAG_TAG],
  }
);

const getCachedBlogTagBySlug = unstable_cache(
  async (slug: string) =>
    client.fetch<BlogTag | null>(blogTagBySlugQuery, { slug }),
  ["sanity-blog-tag-by-slug"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [SANITY_BLOG_TAG_TAG],
  }
);

const getCachedBlogAuthors = unstable_cache(
  async () => client.fetch<BlogAuthor[]>(blogAuthorsQuery),
  ["sanity-blog-authors"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [SANITY_BLOG_AUTHOR_TAG],
  }
);

const getCachedBlogAuthorBySlug = unstable_cache(
  async (slug: string) =>
    client.fetch<BlogAuthor | null>(blogAuthorBySlugQuery, { slug }),
  ["sanity-blog-author-by-slug"],
  {
    revalidate: DEFAULT_REVALIDATE,
    tags: [SANITY_BLOG_AUTHOR_TAG],
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

function normalizeString(value?: string | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeImage(image?: SanityImageAsset | null): SanityImageAsset | null {
  if (!image?.url) {
    return null;
  }

  return {
    url: image.url,
    alt: normalizeString(image.alt),
    width: image.width,
    height: image.height,
    aspectRatio: image.aspectRatio,
    lqip: image.lqip,
    palette: image.palette,
  };
}

function normalizeBlogCategory(
  category?: BlogCategory | null
): BlogCategory | null {
  if (!category?.slug) {
    return null;
  }

  return {
    _id: category._id,
    title: category.title ?? "",
    slug: category.slug,
    description: category.description ?? "",
    seo: category.seo ? fallbackSeo(category.seo) : undefined,
    postCount:
      typeof category.postCount === "number" && category.postCount >= 0
        ? category.postCount
        : undefined,
  };
}

function normalizeBlogTag(tag?: BlogTag | null): BlogTag | null {
  if (!tag?.slug) {
    return null;
  }

  return {
    _id: tag._id,
    title: tag.title ?? "",
    slug: tag.slug,
    description: tag.description ?? "",
    seo: tag.seo ? fallbackSeo(tag.seo) : undefined,
    postCount:
      typeof tag.postCount === "number" && tag.postCount >= 0
        ? tag.postCount
        : undefined,
  };
}

function normalizeBlogAuthor(author?: BlogAuthor | null): BlogAuthor | null {
  if (!author?.slug || !author.name) {
    return null;
  }

  const normalizedImage = normalizeImage(author.image);
  const social = author.social ?? {};

  const normalizedSocial = {
    twitter: normalizeString(social.twitter),
    linkedin: normalizeString(social.linkedin),
    github: normalizeString(social.github),
    website: normalizeString((social as { website?: string }).website),
  } as BlogAuthor["social"];

  const hasSocial = Object.values(normalizedSocial).some(Boolean);

  return {
    _id: author._id,
    name: author.name,
    slug: author.slug,
    title: author.title ?? undefined,
    role: author.role ?? undefined,
    company: author.company ?? undefined,
    shortBio: normalizeString(author.shortBio),
    bio: Array.isArray(author.bio) ? author.bio : [],
    image: normalizedImage,
    social: hasSocial ? normalizedSocial : undefined,
    seo: author.seo ? fallbackSeo(author.seo) : undefined,
  };
}

function normalizeBlogPost(
  post?: BlogPostDocument | null
): BlogPostDocument | null {
  if (!post?.slug) {
    return null;
  }

  const categories = (post.categories ?? [])
    .map((category) => normalizeBlogCategory(category))
    .filter((category): category is BlogCategory => Boolean(category));

  const tags = (post.tags ?? [])
    .map((tag) => normalizeBlogTag(tag))
    .filter((tag): tag is BlogTag => Boolean(tag));

  const author = normalizeBlogAuthor(post.author);
  const featuredImage = normalizeImage(post.featuredImage);

  const readingTimeValue =
    typeof post.readingTimeMinutes === "string"
      ? parseFloat(post.readingTimeMinutes)
      : post.readingTimeMinutes;

  const readingTimeMinutes =
    typeof readingTimeValue === "number" && Number.isFinite(readingTimeValue)
      ? Math.max(readingTimeValue, 0)
      : undefined;

  const readingTime =
    normalizeString(post.readingTime) ??
    (readingTimeMinutes && readingTimeMinutes > 0
      ? `${Math.max(1, Math.round(readingTimeMinutes))} min read`
      : undefined);

  const createdAt =
    post.createdAt ?? post.publishedAt ?? new Date().toISOString();
  const publishedAt = post.publishedAt ?? createdAt;
  const updatedAt = post.updatedAt ?? publishedAt ?? createdAt;

  return {
    _id: post._id ?? post.slug,
    _type: post._type ?? "post",
    slug: post.slug,
    title: post.title ?? "",
    excerpt: post.excerpt ?? "",
    body: post.body ?? [],
    categories,
    tags,
    author: author ?? null,
    featuredImage: featuredImage,
    readingTimeMinutes,
    readingTime,
    createdAt,
    publishedAt,
    updatedAt,
    seo: post.seo ? fallbackSeo(post.seo) : undefined,
  };
}

function normalizeBlogPosts(
  posts?: BlogPostDocument[] | null
): BlogPostDocument[] {
  if (!posts) {
    return [];
  }

  return posts
    .map((post) => normalizeBlogPost(post))
    .filter((post): post is BlogPostDocument => Boolean(post));
}

function normalizeBlogCategories(
  categories?: BlogCategory[] | null
): BlogCategory[] {
  if (!categories) {
    return [];
  }

  return categories
    .map((category) => normalizeBlogCategory(category))
    .filter((category): category is BlogCategory => Boolean(category));
}

function normalizeBlogTags(tags?: BlogTag[] | null): BlogTag[] {
  if (!tags) {
    return [];
  }

  return tags
    .map((tag) => normalizeBlogTag(tag))
    .filter((tag): tag is BlogTag => Boolean(tag));
}

function normalizeBlogAuthors(authors?: BlogAuthor[] | null): BlogAuthor[] {
  if (!authors) {
    return [];
  }

  return authors
    .map((author) => normalizeBlogAuthor(author))
    .filter((author): author is BlogAuthor => Boolean(author));
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

export async function getAllBlogPosts(): Promise<BlogPostDocument[]> {
  const { isEnabled } = draftMode();

  if (isEnabled) {
    const posts = await safeFetch(() =>
      previewClient.fetch<BlogPostDocument[]>(blogPostsQuery)
    );

    return normalizeBlogPosts(posts);
  }

  const posts = await safeFetch(() => getCachedBlogPosts());
  return normalizeBlogPosts(posts);
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostDocument | null> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  const { isEnabled } = draftMode();

  if (isEnabled) {
    const post = await safeFetch(() =>
      previewClient.fetch<BlogPostDocument | null>(blogPostBySlugQuery, {
        slug: normalizedSlug,
      })
    );

    return normalizeBlogPost(post);
  }

  const post = await safeFetch(() => getCachedBlogPostBySlug(normalizedSlug));
  return normalizeBlogPost(post);
}

export async function getPaginatedBlogPosts(
  filters: BlogPostFilterParams = {}
): Promise<PaginatedBlogPosts> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.max(1, filters.pageSize ?? BLOG_PAGE_SIZE);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const params: PaginatedBlogPostsQueryParams = {
    start,
    end,
    categorySlug: filters.categorySlug,
    tagSlug: filters.tagSlug,
    authorSlug: filters.authorSlug,
    excludeSlug: filters.excludeSlug,
  };

  const { isEnabled } = draftMode();

  const result = await safeFetch(() =>
    isEnabled
      ? previewClient.fetch<PaginatedBlogPostsQueryResult>(
          paginatedBlogPostsQuery,
          params
        )
      : getCachedPaginatedBlogPosts(params)
  );

  const normalizedPosts = normalizeBlogPosts(result?.posts ?? []);
  const total =
    typeof result?.total === "number" && result.total >= 0 ? result.total : 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return {
    posts: normalizedPosts,
    total,
    page,
    pageSize,
    pageCount,
  };
}

export async function getPostsByCategory(
  slug: string,
  filters: Omit<BlogPostFilterParams, "categorySlug"> = {}
): Promise<PaginatedBlogPosts> {
  return getPaginatedBlogPosts({ ...filters, categorySlug: slug });
}

export async function getPostsByTag(
  slug: string,
  filters: Omit<BlogPostFilterParams, "tagSlug"> = {}
): Promise<PaginatedBlogPosts> {
  return getPaginatedBlogPosts({ ...filters, tagSlug: slug });
}

export async function getPostsByAuthor(
  slug: string,
  filters: Omit<BlogPostFilterParams, "authorSlug"> = {}
): Promise<PaginatedBlogPosts> {
  return getPaginatedBlogPosts({ ...filters, authorSlug: slug });
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const { isEnabled } = draftMode();

  if (isEnabled) {
    const categories = await safeFetch(() =>
      previewClient.fetch<BlogCategory[]>(blogCategoriesQuery)
    );

    return normalizeBlogCategories(categories);
  }

  const categories = await safeFetch(() => getCachedBlogCategories());
  return normalizeBlogCategories(categories);
}

export async function getBlogCategoryBySlug(
  slug: string
): Promise<BlogCategory | null> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  const { isEnabled } = draftMode();

  if (isEnabled) {
    const category = await safeFetch(() =>
      previewClient.fetch<BlogCategory | null>(blogCategoryBySlugQuery, {
        slug: normalizedSlug,
      })
    );

    return normalizeBlogCategory(category);
  }

  const category = await safeFetch(() =>
    getCachedBlogCategoryBySlug(normalizedSlug)
  );
  return normalizeBlogCategory(category);
}

export async function getBlogTags(): Promise<BlogTag[]> {
  const { isEnabled } = draftMode();

  if (isEnabled) {
    const tags = await safeFetch(() =>
      previewClient.fetch<BlogTag[]>(blogTagsQuery)
    );

    return normalizeBlogTags(tags);
  }

  const tags = await safeFetch(() => getCachedBlogTags());
  return normalizeBlogTags(tags);
}

export async function getBlogTagBySlug(
  slug: string
): Promise<BlogTag | null> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  const { isEnabled } = draftMode();

  if (isEnabled) {
    const tag = await safeFetch(() =>
      previewClient.fetch<BlogTag | null>(blogTagBySlugQuery, {
        slug: normalizedSlug,
      })
    );

    return normalizeBlogTag(tag);
  }

  const tag = await safeFetch(() => getCachedBlogTagBySlug(normalizedSlug));
  return normalizeBlogTag(tag);
}

export async function getBlogAuthors(): Promise<BlogAuthor[]> {
  const { isEnabled } = draftMode();

  if (isEnabled) {
    const authors = await safeFetch(() =>
      previewClient.fetch<BlogAuthor[]>(blogAuthorsQuery)
    );

    return normalizeBlogAuthors(authors);
  }

  const authors = await safeFetch(() => getCachedBlogAuthors());
  return normalizeBlogAuthors(authors);
}

export async function getBlogAuthorBySlug(
  slug: string
): Promise<BlogAuthor | null> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  const { isEnabled } = draftMode();

  if (isEnabled) {
    const author = await safeFetch(() =>
      previewClient.fetch<BlogAuthor | null>(blogAuthorBySlugQuery, {
        slug: normalizedSlug,
      })
    );

    return normalizeBlogAuthor(author);
  }

  const author = await safeFetch(() => getCachedBlogAuthorBySlug(normalizedSlug));
  return normalizeBlogAuthor(author);
}
