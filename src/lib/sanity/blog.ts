import { draftMode } from "next/headers";
import type { QueryResponseInitial } from "@sanity/react-loader";
import { loadQuery } from "@sanity/react-loader";

import { calculateReadingTime } from "@/lib/blog";
import {
  BLOG_AUTHOR_QUERY,
  BLOG_AUTHOR_SLUGS_QUERY,
  BLOG_CATEGORY_QUERY,
  BLOG_CATEGORY_SLUGS_QUERY,
  BLOG_INDEX_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_POST_SITEMAP_QUERY,
  BLOG_POST_SLUGS_QUERY,
  BLOG_TAG_QUERY,
  BLOG_TAG_SLUGS_QUERY,
} from "./queries/blog";
import { client } from "./client";
import type {
  BlogAuthor,
  BlogAuthorPayload,
  BlogCategory,
  BlogListingPayload,
  BlogPagination,
  BlogPost,
  BlogPostListItem,
  BlogTag,
  BlogTaxonomyPayload,
} from "@/types";

const BLOG_POSTS_PER_PAGE = 6;
const BLOG_REVALIDATE_SECONDS = 60;
const BLOG_CACHE_TAGS = [
  "sanity:blogPost",
  "sanity:category",
  "sanity:tag",
  "sanity:author",
];

type BlogIndexQueryResult = {
  posts: BlogPostListItem[];
  totalCount: number;
  categories: BlogCategory[];
  tags: BlogTag[];
};

type BlogAuthorQueryResult = {
  author: BlogAuthor | null;
  posts: BlogPostListItem[];
  totalCount: number;
};

type BlogTaxonomyQueryResult = {
  taxonomy: BlogCategory | BlogTag | null;
  posts: BlogPostListItem[];
  totalCount: number;
};

type BlogPostSitemapEntry = {
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  canonical?: string;
};

interface ListingFilters {
  page?: number;
  category?: string | null;
  tag?: string | null;
}

export function buildPagination({
  currentPage,
  pageSize,
  totalCount,
}: {
  currentPage: number;
  pageSize: number;
  totalCount: number;
}): BlogPagination {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);

  return {
    currentPage: safePage,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}

function resolveQueryOptions(isPreview: boolean, tags = BLOG_CACHE_TAGS) {
  if (isPreview) {
    return {
      perspective: "previewDrafts" as const,
      cache: "no-store" as const,
    };
  }

  return {
    perspective: "published" as const,
    next: {
      revalidate: BLOG_REVALIDATE_SECONDS,
      tags,
    },
  };
}

function normalizePage(value?: number) {
  if (!value || Number.isNaN(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

export async function loadBlogListing(filters: ListingFilters = {}) {
  const { isEnabled } = draftMode();
  const pageSize = BLOG_POSTS_PER_PAGE;
  const currentPage = normalizePage(filters.page);
  const offset = (currentPage - 1) * pageSize;
  const rangeEnd = offset + pageSize;

  const params = {
    offset,
    rangeEnd,
    pageSize,
    category: filters.category ?? null,
    tag: filters.tag ?? null,
    author: null,
    excludeSlug: null,
    isPreview: isEnabled,
  };

  const initial = await loadQuery<BlogIndexQueryResult>(
    BLOG_INDEX_QUERY,
    params,
    resolveQueryOptions(isEnabled)
  );

  const totalCount = initial.data?.totalCount ?? 0;
  const pagination = buildPagination({ currentPage, pageSize, totalCount });

  const payload: BlogListingPayload = {
    posts: initial.data?.posts ?? [],
    pagination,
    categories: initial.data?.categories ?? [],
    tags: initial.data?.tags ?? [],
  };

  return {
    query: BLOG_INDEX_QUERY,
    params,
    initial,
    payload,
  } as {
    query: string;
    params: typeof params;
    initial: QueryResponseInitial<BlogIndexQueryResult>;
    payload: BlogListingPayload;
  };
}

export async function loadBlogPost(slug: string) {
  const { isEnabled } = draftMode();
  const params = {
    slug,
    category: null,
    tag: null,
    author: null,
    excludeSlug: slug,
    offset: 0,
    rangeEnd: 0,
    pageSize: 0,
    isPreview: isEnabled,
  };

  const initial = await loadQuery<BlogPost | null>(
    BLOG_POST_BY_SLUG_QUERY,
    params,
    resolveQueryOptions(isEnabled)
  );

  const post = initial.data
    ? {
        ...initial.data,
        readingTimeMinutes:
          initial.data.readingTimeMinutes ?? calculateReadingTime(initial.data.body) ?? undefined,
      }
    : null;

  return {
    query: BLOG_POST_BY_SLUG_QUERY,
    params,
    initial,
    post,
  } as {
    query: string;
    params: typeof params;
    initial: QueryResponseInitial<BlogPost | null>;
    post: BlogPost | null;
  };
}

export async function getPublishedBlogPost(slug: string) {
  const params = {
    slug,
    category: null,
    tag: null,
    author: null,
    excludeSlug: slug,
    offset: 0,
    rangeEnd: 0,
    pageSize: 0,
    isPreview: false,
  };

  const post = await client.fetch<BlogPost | null>(
    BLOG_POST_BY_SLUG_QUERY,
    params,
    {
      perspective: "published",
      next: {
        revalidate: BLOG_REVALIDATE_SECONDS,
        tags: BLOG_CACHE_TAGS,
      },
    }
  );

  if (!post) {
    return null;
  }

  return {
    ...post,
    readingTimeMinutes:
      post.readingTimeMinutes ?? calculateReadingTime(post.body) ?? undefined,
  } satisfies BlogPost;
}

export async function loadBlogAuthor(
  slug: string,
  page = 1
): Promise<{
  query: string;
  params: Record<string, unknown>;
  initial: QueryResponseInitial<BlogAuthorQueryResult>;
  payload: BlogAuthorPayload;
}> {
  const { isEnabled } = draftMode();
  const pageSize = BLOG_POSTS_PER_PAGE;
  const currentPage = normalizePage(page);
  const offset = (currentPage - 1) * pageSize;
  const rangeEnd = offset + pageSize;

  const params = {
    slug,
    offset,
    rangeEnd,
    pageSize,
    category: null,
    tag: null,
    author: slug,
    excludeSlug: null,
    isPreview: isEnabled,
  };

  const initial = await loadQuery<BlogAuthorQueryResult>(
    BLOG_AUTHOR_QUERY,
    params,
    resolveQueryOptions(isEnabled)
  );

  const totalCount = initial.data?.totalCount ?? 0;
  const pagination = buildPagination({ currentPage, pageSize, totalCount });

  const payload: BlogAuthorPayload = {
    author: initial.data?.author ?? null,
    posts: initial.data?.posts ?? [],
    pagination,
  };

  return {
    query: BLOG_AUTHOR_QUERY,
    params,
    initial,
    payload,
  };
}

export async function loadBlogCategory(
  slug: string,
  page = 1
): Promise<{
  query: string;
  params: Record<string, unknown>;
  initial: QueryResponseInitial<BlogTaxonomyQueryResult>;
  payload: BlogTaxonomyPayload;
}> {
  const { isEnabled } = draftMode();
  const pageSize = BLOG_POSTS_PER_PAGE;
  const currentPage = normalizePage(page);
  const offset = (currentPage - 1) * pageSize;
  const rangeEnd = offset + pageSize;

  const params = {
    slug,
    offset,
    rangeEnd,
    pageSize,
    category: slug,
    tag: null,
    author: null,
    excludeSlug: null,
    isPreview: isEnabled,
  };

  const initial = await loadQuery<BlogTaxonomyQueryResult>(
    BLOG_CATEGORY_QUERY,
    params,
    resolveQueryOptions(isEnabled)
  );

  const totalCount = initial.data?.totalCount ?? 0;
  const pagination = buildPagination({ currentPage, pageSize, totalCount });

  const payload: BlogTaxonomyPayload = {
    taxonomy: initial.data?.taxonomy ?? null,
    posts: initial.data?.posts ?? [],
    pagination,
  };

  return {
    query: BLOG_CATEGORY_QUERY,
    params,
    initial,
    payload,
  };
}

export async function loadBlogTag(
  slug: string,
  page = 1
): Promise<{
  query: string;
  params: Record<string, unknown>;
  initial: QueryResponseInitial<BlogTaxonomyQueryResult>;
  payload: BlogTaxonomyPayload;
}> {
  const { isEnabled } = draftMode();
  const pageSize = BLOG_POSTS_PER_PAGE;
  const currentPage = normalizePage(page);
  const offset = (currentPage - 1) * pageSize;
  const rangeEnd = offset + pageSize;

  const params = {
    slug,
    offset,
    rangeEnd,
    pageSize,
    category: null,
    tag: slug,
    author: null,
    excludeSlug: null,
    isPreview: isEnabled,
  };

  const initial = await loadQuery<BlogTaxonomyQueryResult>(
    BLOG_TAG_QUERY,
    params,
    resolveQueryOptions(isEnabled)
  );

  const totalCount = initial.data?.totalCount ?? 0;
  const pagination = buildPagination({ currentPage, pageSize, totalCount });

  const payload: BlogTaxonomyPayload = {
    taxonomy: initial.data?.taxonomy ?? null,
    posts: initial.data?.posts ?? [],
    pagination,
  };

  return {
    query: BLOG_TAG_QUERY,
    params,
    initial,
    payload,
  };
}

export async function getAllBlogPostSlugs() {
  const slugs = await client.fetch<{ slug: string }[]>(BLOG_POST_SLUGS_QUERY);
  return slugs.map((entry) => entry.slug).filter(Boolean);
}

export async function getAllBlogCategorySlugs() {
  const slugs = await client.fetch<{ slug: string }[]>(
    BLOG_CATEGORY_SLUGS_QUERY
  );
  return slugs.map((entry) => entry.slug).filter(Boolean);
}

export async function getAllBlogTagSlugs() {
  const slugs = await client.fetch<{ slug: string }[]>(BLOG_TAG_SLUGS_QUERY);
  return slugs.map((entry) => entry.slug).filter(Boolean);
}

export async function getAllBlogAuthorSlugs() {
  const slugs = await client.fetch<{ slug: string }[]>(BLOG_AUTHOR_SLUGS_QUERY);
  return slugs.map((entry) => entry.slug).filter(Boolean);
}

export async function getBlogPostSitemapEntries() {
  const entries = await client.fetch<BlogPostSitemapEntry[]>(
    BLOG_POST_SITEMAP_QUERY
  );
  return entries ?? [];
}

export { BLOG_POSTS_PER_PAGE };
