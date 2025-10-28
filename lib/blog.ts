import readingTime from "reading-time";

import type {
  BlogAuthor,
  BlogCategory,
  BlogPost,
  BlogPostPreview,
  BlogTag,
  PaginatedList,
  SiteSettings
} from "@/types/sanity";
import {
  BLOG_AUTHOR_BY_SLUG_QUERY,
  BLOG_AUTHOR_SLUGS_QUERY,
  BLOG_CATEGORY_BY_SLUG_QUERY,
  BLOG_CATEGORY_SLUGS_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_POST_SLUGS_QUERY,
  BLOG_TAG_BY_SLUG_QUERY,
  BLOG_TAG_SLUGS_QUERY,
  PAGINATED_BLOG_POSTS_QUERY,
  SITE_SETTINGS_QUERY
} from "./sanity/queries";
import { sanityFetch } from "./sanity/client";

const DEFAULT_PAGE_SIZE = Number.parseInt(process.env.NEXT_PUBLIC_BLOG_PAGE_SIZE || "9", 10);

export interface BlogPostWithReading extends BlogPost {
  readingMinutes: number;
  readingText: string;
  wordCount: number;
}

function resolvePageSize(): number {
  return Number.isFinite(DEFAULT_PAGE_SIZE) && DEFAULT_PAGE_SIZE > 0 ? DEFAULT_PAGE_SIZE : 9;
}

function normaliseAuthors(authors?: BlogAuthor[] | null): BlogAuthor[] {
  return Array.isArray(authors) ? authors : [];
}

function normaliseCategories(categories?: BlogCategory[] | null): BlogCategory[] {
  return Array.isArray(categories) ? categories : [];
}

function normaliseTags(tags?: BlogTag[] | null): BlogTag[] {
  return Array.isArray(tags) ? tags : [];
}

function normalisePostPreview(post: BlogPostPreview): BlogPostPreview {
  return {
    ...post,
    categories: normaliseCategories(post.categories),
    tags: normaliseTags(post.tags),
    authors: normaliseAuthors(post.authors)
  };
}

function clampPage(page: number): number {
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.floor(page);
}

export interface BlogFilterInput {
  page?: number;
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
}

interface PaginatedQueryResult {
  total: number;
  posts: BlogPostPreview[];
}

export async function getPaginatedPosts(filter: BlogFilterInput = {}): Promise<PaginatedList<BlogPostPreview>> {
  const pageSize = resolvePageSize();
  const currentPage = clampPage(filter.page ?? 1);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize - 1;

  const data = await sanityFetch<PaginatedQueryResult>({
    query: PAGINATED_BLOG_POSTS_QUERY,
    params: {
      start,
      end,
      categorySlug: filter.categorySlug || undefined,
      tagSlug: filter.tagSlug || undefined,
      authorSlug: filter.authorSlug || undefined
    },
    revalidate: 60,
    tags: ["blog"]
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const boundedPage = Math.min(currentPage, totalPages);

  const posts = Array.isArray(data?.posts) ? data.posts.map(normalisePostPreview) : [];

  return {
    posts,
    total,
    totalPages,
    currentPage: boundedPage,
    pageSize
  };
}

export async function getAllPostSlugs(): Promise<string[]> {
  const data = await sanityFetch<Array<{ slug: string }>>({
    query: BLOG_POST_SLUGS_QUERY,
    revalidate: 3600,
    tags: ["blog"]
  });

  return (data ?? []).map((item) => item.slug).filter(Boolean);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const data = await sanityFetch<Array<{ slug: string }>>({
    query: BLOG_CATEGORY_SLUGS_QUERY,
    revalidate: 3600,
    tags: ["blog"]
  });

  return (data ?? []).map((item) => item.slug).filter(Boolean);
}

export async function getAllTagSlugs(): Promise<string[]> {
  const data = await sanityFetch<Array<{ slug: string }>>({
    query: BLOG_TAG_SLUGS_QUERY,
    revalidate: 3600,
    tags: ["blog"]
  });

  return (data ?? []).map((item) => item.slug).filter(Boolean);
}

export async function getAllAuthorSlugs(): Promise<string[]> {
  const data = await sanityFetch<Array<{ slug: string }>>({
    query: BLOG_AUTHOR_SLUGS_QUERY,
    revalidate: 3600,
    tags: ["blog"]
  });

  return (data ?? []).map((item) => item.slug).filter(Boolean);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const settings = await sanityFetch<SiteSettings | null>({
    query: SITE_SETTINGS_QUERY,
    revalidate: 3600,
    tags: ["siteSettings"]
  });

  return settings ?? null;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithReading | null> {
  if (!slug) return null;

  const post = await sanityFetch<BlogPost | null>({
    query: BLOG_POST_BY_SLUG_QUERY,
    params: { slug },
    revalidate: 60,
    tags: ["blog", `blog:${slug}`]
  });

  if (!post) return null;

  const normalised: BlogPost = {
    ...post,
    categories: normaliseCategories(post.categories),
    tags: normaliseTags(post.tags),
    authors: normaliseAuthors(post.authors),
    content: Array.isArray(post.content) ? post.content : [],
    plainText: post.plainText ?? ""
  };

  const reading = readingTime(normalised.plainText ?? "");
  const readingMinutes = Math.max(1, Math.round(reading.minutes));

  return {
    ...normalised,
    readingMinutes,
    readingText: `${readingMinutes} min read`,
    wordCount: reading.words
  };
}

export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  if (!slug) return null;

  const category = await sanityFetch<BlogCategory | null>({
    query: BLOG_CATEGORY_BY_SLUG_QUERY,
    params: { slug },
    revalidate: 600,
    tags: ["blog", `category:${slug}`]
  });

  return category ?? null;
}

export async function getTagBySlug(slug: string): Promise<BlogTag | null> {
  if (!slug) return null;

  const tag = await sanityFetch<BlogTag | null>({
    query: BLOG_TAG_BY_SLUG_QUERY,
    params: { slug },
    revalidate: 600,
    tags: ["blog", `tag:${slug}`]
  });

  return tag ?? null;
}

export async function getAuthorBySlug(slug: string): Promise<BlogAuthor | null> {
  if (!slug) return null;

  const author = await sanityFetch<BlogAuthor | null>({
    query: BLOG_AUTHOR_BY_SLUG_QUERY,
    params: { slug },
    revalidate: 600,
    tags: ["blog", `author:${slug}`]
  });

  if (!author) {
    return null;
  }

  return {
    ...author,
    bio: Array.isArray(author.bio) ? author.bio : undefined
  };
}
