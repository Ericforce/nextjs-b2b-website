import type { PortableTextBlock } from "@portabletext/types";

export interface SanityImagePaletteSwatch {
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
}

export interface SanityImagePalette {
  dominant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkMuted?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
}

export interface SanityImageAsset {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  lqip?: string;
  palette?: SanityImagePalette;
}

export type SeoImage = SanityImageAsset;

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
  facebook?: string;
  instagram?: string;
}

export interface NavigationLink {
  label: string;
  href: string;
  openInNewTab?: boolean;
}

export type FooterLink = NavigationLink;

export interface FooterSection {
  title?: string;
  links: FooterLink[];
}

export type CtaVariant = "primary" | "secondary" | "ghost" | "link";

export interface CallToAction extends NavigationLink {
  variant?: CtaVariant;
}

export interface SiteNavigation {
  main: NavigationLink[];
  secondary: NavigationLink[];
}

export interface SiteSettings {
  siteName: string;
  description: string;
  locale: string;
  siteUrl: string;
  email?: string;
  logo?: SanityImageAsset;
  favicon?: string;
  defaultSeo: SeoFields;
  navigation: SiteNavigation;
  footerSections: FooterSection[];
  social?: SiteSocialLinks;
  headerCta?: CallToAction | null;
  copyrightText?: string;
  updatedAt: string;
}

export interface BaseSection {
  _key: string;
  _type: string;
  anchor?: string;
}

export interface HeroSection extends BaseSection {
  _type: "heroSection";
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  tagline?: string;
  description?: string;
  alignment?: "left" | "center" | "right";
  backgroundColor?: string;
  primaryCta?: CallToAction | null;
  secondaryCta?: CallToAction | null;
  backgroundImage?: SanityImageAsset | null;
  mediaImage?: SanityImageAsset | null;
}

export interface FeatureGridItem {
  _key?: string;
  title?: string;
  description?: string;
  icon?: string;
  image?: SanityImageAsset | null;
}

export interface FeatureGridSection extends BaseSection {
  _type: "featureGridSection";
  headline?: string;
  description?: string;
  columns?: number;
  features?: FeatureGridItem[];
}

export interface CallToActionSection extends BaseSection {
  _type: "ctaSection";
  headline?: string;
  description?: string;
  alignment?: "left" | "center" | "right";
  backgroundColor?: string;
  primaryCta?: CallToAction | null;
  secondaryCta?: CallToAction | null;
}

export interface Testimonial {
  _key?: string;
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
  rating?: number;
  image?: SanityImageAsset | null;
  logo?: SanityImageAsset | null;
}

export interface TestimonialsSection extends BaseSection {
  _type: "testimonialSection";
  headline?: string;
  description?: string;
  layout?: "carousel" | "grid" | "single";
  testimonials?: Testimonial[];
}

export interface RichTextSection extends BaseSection {
  _type: "richTextSection";
  headline?: string;
  backgroundColor?: string;
  width?: "narrow" | "medium" | "full";
  content?: PortableTextBlock[];
}

export interface FaqEntry {
  _key?: string;
  question?: string;
  answer?: PortableTextBlock[];
}

export interface FaqSection extends BaseSection {
  _type: "faqSection";
  headline?: string;
  layout?: "single-column" | "two-column";
  faqs?: FaqEntry[];
}

export interface Statistic {
  _key?: string;
  value?: string;
  label?: string;
  icon?: string;
}

export interface StatsSection extends BaseSection {
  _type: "statsSection";
  headline?: string;
  description?: string;
  stats?: Statistic[];
}

export interface LogoCloudItem {
  _key?: string;
  href?: string;
  image?: SanityImageAsset | null;
}

export interface LogoCloudSection extends BaseSection {
  _type: "logoCloudSection";
  headline?: string;
  grayscale?: boolean;
  logos?: LogoCloudItem[];
}

export interface ContactDetail {
  _key?: string;
  label?: string;
  value?: string;
  icon?: string;
  href?: string;
}

export interface ContactSection extends BaseSection {
  _type: "contactSection";
  eyebrow?: string;
  headline?: string;
  description?: string;
  backgroundColor?: string;
  showForm?: boolean;
  contactDetails?: ContactDetail[];
}

export interface ReusableSection extends BaseSection {
  _type: "reusableSection";
  title?: string;
  sections?: PageSection[];
}

export interface ReusableSectionReference extends BaseSection {
  _type: "reusableSectionReference";
  section?: ReusableSection;
}

export interface UnknownSection extends BaseSection {}

export type PageSection =
  | HeroSection
  | FeatureGridSection
  | CallToActionSection
  | TestimonialsSection
  | RichTextSection
  | LogoCloudSection
  | FaqSection
  | StatsSection
  | ContactSection
  | ReusableSection
  | ReusableSectionReference
  | UnknownSection;

export interface PageDocument {
  _id?: string;
  _type: "page";
  slug: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  seo?: SeoFields;
  sections?: PageSection[];
}

export interface BlogAuthorSocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface BlogAuthor {
  _id?: string;
  name: string;
  slug: string;
  title?: string;
  role?: string;
  company?: string;
  shortBio?: string;
  bio?: PortableTextBlock[];
  image?: SanityImageAsset | null;
  social?: BlogAuthorSocialLinks;
  seo?: SeoFields;
}

export interface BlogCategory {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  seo?: SeoFields;
  postCount?: number;
}

export interface BlogTag {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  seo?: SeoFields;
  postCount?: number;
}

export interface BlogPostDocument {
  _id?: string;
  _type: "blog.post" | "blogPost" | "post";
  slug: string;
  title: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  categories: BlogCategory[];
  tags: BlogTag[];
  author?: BlogAuthor | null;
  featuredImage?: SanityImageAsset | null;
  readingTimeMinutes?: number;
  readingTime?: string;
  createdAt?: string;
  publishedAt: string;
  updatedAt?: string;
  seo?: SeoFields;
}

export interface PaginatedBlogPosts {
  posts: BlogPostDocument[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}
