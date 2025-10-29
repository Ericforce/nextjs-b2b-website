import type { PortableTextBlock } from "sanity";

export interface SanityReference<T = string> {
  _type: "reference";
  _ref: string;
  _weak?: boolean;
  _key?: string;
  _strengthenOnPublish?: {
    template?: {
      id: string;
      params?: Record<string, unknown>;
    };
    weak?: boolean;
  };
}

export interface SanityDocumentBase {
  _id?: string;
  _type: string;
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
}

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
  ogImage?: SeoImage | ImageWithAltValue;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: SeoImage | ImageWithAltValue;
}

export interface SiteSocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
  facebook?: string;
}

export type ImageWithAltValue =
  | string
  | {
      _type?: "image" | "imageWithAlt";
      alt?: string;
      caption?: string;
      asset?: SanityReference;
      url?: string;
      width?: number;
      height?: number;
    };

export type PortableTextValue = PortableTextBlock[];

export interface LinkValue {
  _type?: "link";
  label: string;
  href?: string;
  reference?: SanityReference;
  openInNewTab?: boolean;
}

export interface LinkGroup {
  _type?: "linkGroup";
  title: string;
  links: LinkValue[];
}

export interface Cta {
  _type?: "cta";
  label: string;
  link: LinkValue;
  variant?: "primary" | "secondary" | "ghost" | "link";
  icon?: string;
}

export interface FeatureItem {
  _type?: "feature";
  _key?: string;
  title: string;
  description: string;
  icon?: string;
  image?: ImageWithAltValue;
  cta?: Cta;
}

export interface TestimonialItem {
  _type?: "testimonial";
  _key?: string;
  quote: string;
  authorName: string;
  authorTitle?: string;
  company?: string;
  image?: ImageWithAltValue;
  rating?: number;
}

export interface FaqItem {
  _type?: "faqItem";
  _key?: string;
  question: string;
  answer: PortableTextValue | string;
}

export interface LogoItem {
  _type?: "logoItem";
  _key?: string;
  image: ImageWithAltValue;
  link?: LinkValue;
}

export interface StatItem {
  _type?: "stat";
  _key?: string;
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface HeroSection {
  _type: "heroSection";
  _key?: string;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  backgroundImage?: ImageWithAltValue;
  alignment?: "left" | "center" | "right";
  theme?: "light" | "dark" | "accent";
}

export interface FeatureGridSection {
  _type: "featureGridSection";
  _key?: string;
  headline: string;
  description?: string;
  features?: FeatureItem[];
  columns?: 2 | 3 | 4;
  background?: "default" | "muted" | "primary";
}

export interface CtaSection {
  _type: "ctaSection";
  _key?: string;
  headline: string;
  description?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  alignment?: "left" | "center" | "right";
  background?: "default" | "muted" | "primary" | "dark";
}

export interface TestimonialsSection {
  _type: "testimonialsSection";
  _key?: string;
  headline: string;
  subheadline?: string;
  layout?: "carousel" | "grid" | "single";
  testimonials?: TestimonialItem[];
}

export interface RichTextSection {
  _type: "richTextSection";
  _key?: string;
  headline?: string;
  content: PortableTextValue | string;
  background?: "default" | "muted" | "primary" | "dark";
  width?: "narrow" | "default" | "full";
}

export interface LogoCloudSection {
  _type: "logoCloudSection";
  _key?: string;
  headline?: string;
  subheadline?: string;
  logos?: LogoItem[];
  grayscale?: boolean;
}

export interface FaqSection {
  _type: "faqSection";
  _key?: string;
  headline: string;
  intro?: string;
  layout?: "single" | "twoColumn";
  faqs?: FaqItem[];
}

export interface StatsSection {
  _type: "statsSection";
  _key?: string;
  headline: string;
  description?: string;
  stats?: StatItem[];
  layout?: "grid" | "highlight";
  background?: "default" | "muted" | "primary";
}

export type ReusableSectionContent =
  | HeroSection
  | FeatureGridSection
  | CtaSection
  | TestimonialsSection
  | RichTextSection
  | LogoCloudSection
  | FaqSection
  | StatsSection;

export type PageSection =
  | ReusableSectionContent
  | SanityReference<ReusableSectionDocument>;

export interface ReusableSectionDocument extends SanityDocumentBase {
  _type: "reusableSection";
  title: string;
  slug: string;
  description?: string;
  sections: ReusableSectionContent[];
}

export interface PageDocument extends SanityDocumentBase {
  _type: "page";
  title: string;
  slug: string;
  hero?: HeroSection;
  sections?: PageSection[];
  seo?: SeoFields;
  publishedAt?: string;
  status?: "draft" | "review" | "scheduled" | "published" | "archived";
  notes?: string;
  description?: string;
  body?: string | PortableTextValue;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogAuthor {
  name: string;
  slug?: string;
  bio?: string | PortableTextValue;
  url?: string;
  image?: ImageWithAltValue;
  social?: SiteSocialLinks;
}

export interface AuthorDocument extends SanityDocumentBase {
  _type: "author";
  name: string;
  slug: string;
  role?: string;
  bio?: PortableTextValue | string;
  headshot?: ImageWithAltValue;
  social?: SiteSocialLinks;
}

export interface CategoryDocument extends SanityDocumentBase {
  _type: "category";
  title: string;
  slug: string;
  description?: string;
}

export interface TagDocument extends SanityDocumentBase {
  _type: "tag";
  title: string;
  slug: string;
  description?: string;
}

export interface BlogPostDocument extends SanityDocumentBase {
  _type: "blogPost" | "post";
  slug: string;
  title: string;
  excerpt?: string;
  heroImage?: ImageWithAltValue;
  featuredImage?: SeoImage; // legacy static data support
  body?: PortableTextValue | string;
  categories?: Array<SanityReference<CategoryDocument> | CategoryDocument>;
  tags?:
    | string[]
    | Array<SanityReference<TagDocument> | TagDocument>;
  author?:
    | BlogAuthor
    | AuthorDocument
    | SanityReference<AuthorDocument>
    | null;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  readingTime?: string;
  featured?: boolean;
  seo?: SeoFields;
}

export interface SiteSettings {
  siteName: string;
  description: string;
  locale?: string;
  siteUrl: string;
  tagline?: string;
  favicon?: ImageWithAltValue;
  logo?: ImageWithAltValue;
  defaultSeo: SeoFields;
  social?: SiteSocialLinks;
  headerNavigation?: LinkValue[];
  footerNavigation?: LinkGroup[];
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  updatedAt?: string;
}
