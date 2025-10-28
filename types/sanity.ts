import type { PortableTextBlock } from "@portabletext/types";

export interface SanityImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface SanityImageMetadata {
  lqip?: string;
  dimensions?: SanityImageDimensions;
}

export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata?: SanityImageMetadata;
}

export interface SanityImageValue {
  asset?: SanityImageAsset;
  alt?: string;
  caption?: string;
}

export interface SanityImageWithAlt {
  priority?: boolean;
  image?: SanityImageValue;
}

export interface BlogTaxonomy {
  _id: string;
  title: string;
  slug: string;
}

export interface BlogCategory extends BlogTaxonomy {
  description?: string;
}

export interface BlogTag extends BlogTaxonomy {}

export interface BlogAuthor {
  _id: string;
  name: string;
  slug: string;
  image?: SanityImageValue;
  bio?: PortableTextBlock[];
}

export interface BlogPostPreview {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  heroImage?: SanityImageWithAlt;
  categories: BlogCategory[];
  tags: BlogTag[];
  authors: BlogAuthor[];
}

export interface BlogPost extends BlogPostPreview {
  content: PortableTextBlock[];
  plainText?: string;
  seo?: {
    title?: string;
    description?: string;
    openGraphImage?: SanityImageWithAlt;
  } | null;
}

export interface PaginatedList<TItem> {
  posts: TItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface SiteSeoSettings {
  title?: string;
  description?: string;
  openGraphImage?: SanityImageWithAlt;
}

export interface SiteSettings {
  contactEmail?: string;
  defaultSeo?: SiteSeoSettings | null;
}
