export interface SeoImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
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

export interface BlogAuthor {
  name: string;
  url?: string;
}

export interface BlogPostDocument {
  _type: "post";
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags?: string[];
  readingTime?: string;
  featuredImage?: SeoImage;
  createdAt: string;
  publishedAt: string;
  updatedAt?: string;
  author: BlogAuthor;
  seo?: SeoFields;
}
