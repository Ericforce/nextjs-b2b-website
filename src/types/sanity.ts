import type { PortableTextBlock } from "@portabletext/types";

export interface SanityImageAsset {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
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
  href?: string;
  reference?: PageDocument | BlogPostDocument;
  openInNewTab?: boolean;
}

export type FooterLink = NavigationLink;

export interface FooterSection {
  title?: string;
  links: FooterLink[];
}

export type CtaVariant = "primary" | "secondary" | "ghost" | "link";

export interface CallToAction {
  text: string;
  href?: string;
  reference?: PageDocument | BlogPostDocument;
  variant?: CtaVariant;
  openInNewTab?: boolean;
}

export interface SiteNavigation {
  main: NavigationLink[];
  secondary: NavigationLink[];
}

export interface SiteSettings {
  _id: string;
  _type: "siteSettings";
  title: string;
  description?: string;
  locale?: string;
  siteUrl?: string;
  contactEmail?: string;
  logo?: SanityImageAsset;
  favicon?: string;
  defaultSeo?: SeoFields;
  mainNavigation?: NavigationLink[];
  secondaryNavigation?: NavigationLink[];
  headerCTA?: CallToAction;
  footerSections?: FooterSection[];
  socialLinks?: SiteSocialLinks;
  copyrightText?: string;
  _updatedAt?: string;
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
  primaryCTA?: CallToAction;
  secondaryCTA?: CallToAction;
  backgroundImage?: SanityImageAsset;
  media?: {
    image?: SanityImageAsset;
  };
}

export interface FeatureGridItem {
  _key?: string;
  title?: string;
  description?: string;
  icon?: string;
  image?: SanityImageAsset;
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
  primaryCTA?: CallToAction;
  secondaryCTA?: CallToAction;
}

export interface Testimonial {
  _key?: string;
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
  rating?: number;
  image?: SanityImageAsset;
  logo?: SanityImageAsset;
}

export interface TestimonialSection extends BaseSection {
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
  image?: SanityImageAsset;
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

export interface ReusableSectionDocument {
  _id: string;
  _type: "reusableSection";
  title: string;
  description?: string;
  sections?: PageSection[];
  _updatedAt?: string;
}

export interface ReusableSection extends BaseSection {
  _type: "reusableSection";
  title?: string;
  sections?: PageSection[];
}

export interface ReusableSectionReference extends BaseSection {
  _type: "reusableSectionReference";
  section?: ReusableSectionDocument;
}

export interface UnknownSection extends BaseSection {
  _type: string;
}

export type PageSection =
  | HeroSection
  | FeatureGridSection
  | CallToActionSection
  | TestimonialSection
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
  slug: {
    current: string;
  };
  title: string;
  description?: string;
  publishedAt?: string;
  createdAt?: string;
  _updatedAt?: string;
  seo?: SeoFields;
  sections?: PageSection[];
}

export interface AuthorDocument {
  _id: string;
  _type: "author";
  slug: string;
  name: string;
  bio?: string;
  role?: string;
  image?: SanityImageAsset;
  website?: string;
  email?: string;
  social?: SiteSocialLinks;
  _updatedAt?: string;
}

export interface CategoryDocument {
  _id: string;
  _type: "category";
  slug: string;
  title: string;
  description?: string;
  color?: string;
  icon?: string;
  postCount?: number;
  _updatedAt?: string;
}

export interface TagDocument {
  _id: string;
  _type: "tag";
  slug: string;
  title: string;
  description?: string;
  color?: string;
  postCount?: number;
  _updatedAt?: string;
}

export interface BlogPostDocument {
  _id: string;
  _type: "blogPost";
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: SanityImageAsset;
  body?: PortableTextBlock[];
  author?: AuthorDocument | null;
  categories: CategoryDocument[];
  tags: TagDocument[];
  readingTime?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  seo?: SeoFields;
}

// Link annotations for Portable Text
export interface LinkInternalAnnotation {
  _type: "linkInternal";
  reference?: PageDocument | BlogPostDocument;
}

export interface LinkExternalAnnotation {
  _type: "linkExternal";
  href: string;
  openInNewTab?: boolean;
}

// Code block object for Portable Text
export interface CodeBlock {
  _type: "codeBlock";
  language?: string;
  code: string;
  filename?: string;
}

// Image object for Portable Text
export interface PortableTextImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  caption?: string;
}
