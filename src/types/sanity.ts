import type { PortableTextBlock } from "sanity";

export interface SanitySlug {
  current: string;
}

export interface SanityReference<TType extends string = string> {
  _type: "reference";
  _ref: string;
  _weak?: boolean;
  _key?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface ImageWithMetadata {
  _type: "image";
  _key?: string;
  asset: SanityReference<"sanity.imageAsset">;
  alt?: string | null;
  caption?: string | null;
  lqip?: string | null;
  dimensions?: ImageDimensions;
}

export interface SeoImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  lqip?: string | null;
}

export interface SeoFields {
  title?: string;
  description?: string;
  titleTemplate?: string;
  canonical?: string;
  noIndex?: boolean;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: SeoImage;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: SeoImage;
}

export interface SiteSocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
}

export interface SiteSettings {
  siteName: string;
  description: string;
  locale: string;
  siteUrl: string;
  email?: string;
  favicon?: string;
  logo?: string;
  defaultSeo: SeoFields;
  social?: SiteSocialLinks;
  updatedAt: string;
}

export interface PageDocument {
  _type: "page";
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  seo?: SeoFields;
}

export interface AuthorSocialLinks {
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
}

export interface BlogAuthor {
  _id: string;
  name: string;
  slug: string;
  title?: string;
  bio?: string;
  image?: ImageWithMetadata;
  social?: AuthorSocialLinks;
}

export interface BlogCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export interface BlogTag {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export type PortableText = PortableTextBlock[];

export interface BlogPostBase {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  publishedAt: string;
  updatedAt?: string;
  mainImage?: ImageWithMetadata;
  mainImageUrl?: string;
  author?: BlogAuthor;
  categories?: BlogCategory[];
  tags?: BlogTag[];
  readingTimeMinutes?: number;
  seo?: SeoFields;
}

export interface BlogPostListItem extends BlogPostBase {}

export interface BlogPost extends BlogPostBase {
  body: PortableText;
  relatedPosts?: BlogPostListItem[];
}

export interface BlogPagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BlogListingPayload {
  posts: BlogPostListItem[];
  pagination: BlogPagination;
  categories: BlogCategory[];
  tags: BlogTag[];
}

export interface BlogAuthorPayload {
  author: BlogAuthor | null;
  posts: BlogPostListItem[];
  pagination: BlogPagination;
}

export interface BlogTaxonomyPayload {
  taxonomy: (BlogCategory | BlogTag) | null;
  posts: BlogPostListItem[];
  pagination: BlogPagination;
}
