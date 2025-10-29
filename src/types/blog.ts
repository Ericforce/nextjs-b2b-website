import type { PortableTextBlock } from "@portabletext/types";

export interface SanityImageAsset {
  _id?: string;
  url?: string;
  metadata?: {
    dimensions?: {
      width?: number;
      height?: number;
      aspectRatio?: number;
    };
    lqip?: string;
  };
}

export interface SanityImage {
  _type?: string;
  asset?: {
    _ref?: string;
    _id?: string;
    url?: string;
    metadata?: SanityImageAsset["metadata"];
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  metadata?: SanityImageAsset["metadata"];
}

export interface BlogCategory {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

export interface BlogTag {
  id: string;
  title: string;
  slug: string;
}

export interface BlogAuthor {
  id: string;
  name?: string;
  slug?: string;
  role?: string;
  bio?: string;
  avatar?: SanityImage;
}

export interface BlogPostSeo {
  title?: string;
  description?: string;
  ogImage?: SanityImage;
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: SanityImage;
  categories: BlogCategory[];
  tags: BlogTag[];
  publishedAt?: string;
  updatedAt?: string;
  estimatedReadingTime: number;
  author?: BlogAuthor;
  seo?: BlogPostSeo;
  featured?: boolean;
}

export interface BlogPost extends BlogPostSummary {
  body?: PortableTextBlock[];
  bodyPlainText?: string;
  relatedPosts?: BlogPostSummary[];
}

export interface BlogIndexResult {
  posts: BlogPostSummary[];
  total: number;
}
