import groq from "groq";
import type { PortableTextBlock } from "@portabletext/types";
import type {
  BlogCategory,
  BlogIndexResult,
  BlogPost,
  BlogPostSummary,
  BlogTag,
  BlogPostSeo,
  BlogAuthor,
  SanityImage,
} from "@/types/blog";
import {
  calculateReadingTime,
  getPlainTextFromPortableText,
} from "@/lib/utils/reading-time";
import { isSanityConfigured } from "../config";
import { sanityFetch } from "../client";

const BLOG_IMAGE_FIELDS = `
  ...,
  asset->{
    _id,
    url,
    metadata{
      dimensions,
      lqip
    }
  },
  alt,
  caption
`;

const BLOG_AUTHOR_PROJECTION = `{
  _id,
  name,
  role,
  bio,
  "slug": slug.current,
  "avatar": image{
    ${BLOG_IMAGE_FIELDS}
  }
}`;

const BLOG_POST_SUMMARY_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  featured,
  publishedAt,
  "updatedAt": coalesce(_updatedAt, _createdAt, publishedAt),
  "coverImage": coalesce(mainImage, coverImage){
    ${BLOG_IMAGE_FIELDS}
  },
  "categories": categories[]->{
    _id,
    title,
    description,
    "slug": slug.current
  },
  "tags": tags[]->{
    _id,
    title,
    "slug": slug.current
  },
  "author": author->${BLOG_AUTHOR_PROJECTION},
  "bodyPlainText": coalesce(bodyPlaintext, pt::text(body))
`;

const BLOG_SEO_PROJECTION = `
  "title": coalesce(seo.title, title),
  "description": coalesce(seo.description, excerpt),
  "ogImage": coalesce(seo.ogImage, coalesce(mainImage, coverImage)){
    ${BLOG_IMAGE_FIELDS}
  }
`;

const BLOG_POST_DETAIL_PROJECTION = `
  ${BLOG_POST_SUMMARY_PROJECTION},
  body,
  "seo": { ${BLOG_SEO_PROJECTION} }
`;

const BLOG_INDEX_QUERY = groq`{
  "posts": *[
    _type == "post" &&
    defined(slug.current) &&
    (!defined($categorySlug) || $categorySlug == "" || $categorySlug in categories[]->slug.current) &&
    (!defined($tagSlug) || $tagSlug == "" || $tagSlug in tags[]->slug.current)
  ] | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc)[$start...$end]{
    ${BLOG_POST_SUMMARY_PROJECTION}
  },
  "total": count(*[
    _type == "post" &&
    defined(slug.current) &&
    (!defined($categorySlug) || $categorySlug == "" || $categorySlug in categories[]->slug.current) &&
    (!defined($tagSlug) || $tagSlug == "" || $tagSlug in tags[]->slug.current)
  ])
}`;

const POST_BY_SLUG_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
  "categoryRefs": categories[]._ref,
  "tagRefs": tags[]._ref,
  ${BLOG_POST_DETAIL_PROJECTION},
  "relatedPosts": *[
    _type == "post" &&
    defined(slug.current) &&
    slug.current != $slug &&
    (
      count(categories[@._ref in ^.categoryRefs]) > 0 ||
      count(tags[@._ref in ^.tagRefs]) > 0
    )
  ] | order(coalesce(publishedAt, _createdAt) desc, _createdAt desc)[0...3]{
    ${BLOG_POST_SUMMARY_PROJECTION}
  }
}`;

const CATEGORIES_QUERY = groq`*[_type == "category" && defined(slug.current)] | order(title asc){
  _id,
  title,
  description,
  "slug": slug.current
}`;

const TAGS_QUERY = groq`*[_type == "tag" && defined(slug.current)] | order(title asc){
  _id,
  title,
  "slug": slug.current
}`;

type RawSanityCategory = {
  _id: string;
  title?: string;
  description?: string;
  slug?: string;
};

type RawSanityTag = {
  _id: string;
  title?: string;
  slug?: string;
};

type RawSanityAuthor = {
  _id: string;
  name?: string;
  role?: string;
  bio?: string;
  slug?: string;
  avatar?: SanityImage;
};

type RawSanityPostSummary = {
  _id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  featured?: boolean;
  publishedAt?: string;
  updatedAt?: string;
  coverImage?: SanityImage;
  categories?: RawSanityCategory[];
  tags?: RawSanityTag[];
  author?: RawSanityAuthor;
  bodyPlainText?: string;
  seo?: BlogPostSeo;
};

type RawSanityPostDetail = RawSanityPostSummary & {
  body?: PortableTextBlock[];
  relatedPosts?: RawSanityPostSummary[];
};

function mapCategory(raw?: RawSanityCategory | null): BlogCategory | null {
  if (!raw?._id || !raw?.slug) {
    return null;
  }

  return {
    id: raw._id,
    title: raw.title ?? "",
    slug: raw.slug,
    description: raw.description,
  };
}

function mapTag(raw?: RawSanityTag | null): BlogTag | null {
  if (!raw?._id || !raw?.slug) {
    return null;
  }

  return {
    id: raw._id,
    title: raw.title ?? "",
    slug: raw.slug,
  };
}

function mapAuthor(raw?: RawSanityAuthor | null): BlogAuthor | undefined {
  if (!raw?._id) {
    return undefined;
  }

  return {
    id: raw._id,
    name: raw.name,
    role: raw.role,
    bio: raw.bio,
    slug: raw.slug,
    avatar: raw.avatar,
  };
}

function mapPostSummary(
  raw?: RawSanityPostSummary | null
): BlogPostSummary | null {
  if (!raw?._id || !raw?.slug) {
    return null;
  }

  const plainTextSource = raw.bodyPlainText || raw.excerpt || "";
  const readingTime = calculateReadingTime(plainTextSource);

  const categories =
    raw.categories
      ?.map(mapCategory)
      ?.filter((category): category is BlogCategory => Boolean(category)) ?? [];

  const tags =
    raw.tags?.map(mapTag)?.filter((tag): tag is BlogTag => Boolean(tag)) ?? [];

  return {
    id: raw._id,
    title: raw.title ?? "Untitled post",
    slug: raw.slug,
    excerpt: raw.excerpt,
    featured: Boolean(raw.featured),
    coverImage: raw.coverImage,
    categories,
    tags,
    publishedAt: raw.publishedAt,
    updatedAt: raw.updatedAt,
    estimatedReadingTime: readingTime,
    author: mapAuthor(raw.author),
    seo: raw.seo,
  };
}

function mapPostDetail(raw?: RawSanityPostDetail | null): BlogPost | null {
  const summary = mapPostSummary(raw);

  if (!summary) {
    return null;
  }

  const bodyPlainText = raw?.body
    ? getPlainTextFromPortableText(raw.body)
    : raw?.bodyPlainText;

  const enrichedReadingTime = calculateReadingTime(
    bodyPlainText || raw?.bodyPlainText || summary.excerpt || ""
  );

  const relatedPostsList =
    raw?.relatedPosts
      ?.map(mapPostSummary)
      ?.filter((related): related is BlogPostSummary => Boolean(related)) ?? [];

  const relatedPosts = relatedPostsList.length > 0 ? relatedPostsList : undefined;

  return {
    ...summary,
    body: raw?.body,
    bodyPlainText,
    relatedPosts,
    estimatedReadingTime: enrichedReadingTime || summary.estimatedReadingTime,
  };
}

export interface FetchBlogIndexParams {
  page?: number;
  limit?: number;
  categorySlug?: string | null;
  tagSlug?: string | null;
  preview?: boolean;
}

export async function fetchBlogIndex(
  params: FetchBlogIndexParams = {}
): Promise<BlogIndexResult> {
  if (!isSanityConfigured()) {
    return { posts: [], total: 0 };
  }

  const {
    page = 1,
    limit = 9,
    categorySlug,
    tagSlug,
    preview,
  } = params;

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 9;
  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit - 1;

  try {
    const data = await sanityFetch<{
      posts: RawSanityPostSummary[];
      total: number;
    }>(
      BLOG_INDEX_QUERY,
      {
        start,
        end,
        categorySlug: categorySlug || null,
        tagSlug: tagSlug || null,
      },
      { preview }
    );

    const posts = Array.isArray(data.posts)
      ? (data.posts
          .map(mapPostSummary)
          .filter(Boolean) as BlogPostSummary[])
      : [];

    return {
      posts,
      total: typeof data.total === "number" ? data.total : 0,
    };
  } catch (error) {
    console.error("Failed to fetch blog index from Sanity", error);
    return { posts: [], total: 0 };
  }
}

export interface FetchPostBySlugParams {
  slug: string;
  preview?: boolean;
}

export async function fetchPostBySlug(
  params: FetchPostBySlugParams
): Promise<BlogPost | null> {
  if (!isSanityConfigured() || !params?.slug) {
    return null;
  }

  try {
    const rawPost = await sanityFetch<RawSanityPostDetail | null>(
      POST_BY_SLUG_QUERY,
      { slug: params.slug },
      { preview: params.preview }
    );

    return mapPostDetail(rawPost) ?? null;
  } catch (error) {
    console.error("Failed to fetch blog post from Sanity", error);
    return null;
  }
}

export async function fetchCategories(
  preview?: boolean
): Promise<BlogCategory[]> {
  if (!isSanityConfigured()) {
    return [];
  }

  try {
    const categories = await sanityFetch<RawSanityCategory[]>(
      CATEGORIES_QUERY,
      {},
      { preview }
    );

    return categories
      .map(mapCategory)
      .filter(Boolean) as BlogCategory[];
  } catch (error) {
    console.error("Failed to fetch categories from Sanity", error);
    return [];
  }
}

export async function fetchTags(preview?: boolean): Promise<BlogTag[]> {
  if (!isSanityConfigured()) {
    return [];
  }

  try {
    const tags = await sanityFetch<RawSanityTag[]>(
      TAGS_QUERY,
      {},
      { preview }
    );

    return tags.map(mapTag).filter(Boolean) as BlogTag[];
  } catch (error) {
    console.error("Failed to fetch tags from Sanity", error);
    return [];
  }
}
