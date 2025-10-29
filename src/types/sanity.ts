import type { PortableTextBlock } from "sanity";

export interface Slug {
  _type?: "slug";
  current: string;
}

export interface SanityReference<TType extends string = string> {
  _type: "reference";
  _ref: string;
  _weak?: boolean;
}

export interface SanityImageCrop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface SanityImageHotspot {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface SanityImage {
  _type?: "image" | "socialImage";
  asset?: SanityReference<"sanity.imageAsset">;
  alt?: string;
  caption?: string;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
  url?: string;
  width?: number;
  height?: number;
}

export type SeoImage = SanityImage;

export interface CalloutValue {
  _type: "callout";
  tone?: "info" | "success" | "warning" | "danger";
  title?: string;
  body: string;
}

export type PortableTextValue = Array<PortableTextBlock | SanityImage | CalloutValue>;

export type LinkStyle = "default" | "primary" | "secondary" | "ghost" | "link";

export type LinkIcon = "none" | "arrowRight" | "arrowDown" | "external" | "download";

export interface LinkValue {
  _type: "link";
  label: string;
  linkType: "internal" | "external";
  reference?: SanityReference<
    | "page"
    | "blogPost"
    | "category"
    | "tag"
    | "reusableSection"
  >;
  url?: string;
  style?: LinkStyle;
  openInNewTab?: boolean;
  icon?: LinkIcon;
}

export interface NavigationGroup {
  _type: "navigationGroup";
  title?: string;
  links: LinkValue[];
}

export type SocialPlatform =
  | "twitter"
  | "linkedin"
  | "github"
  | "youtube"
  | "facebook"
  | "instagram"
  | "tiktok";

export interface SiteSocialLink {
  _type: "socialLink";
  platform: SocialPlatform;
  handle?: string;
  url?: string;
  icon?: string;
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

export interface SiteSettings {
  _type: "siteSettings";
  siteName: string;
  organizationName?: string;
  tagline?: string;
  description?: string;
  locale: string;
  siteUrl: string;
  contactEmail?: string;
  logo?: SanityImage | string;
  favicon?: SanityImage | string;
  headerNavigation: NavigationGroup[];
  footerNavigation?: NavigationGroup[];
  socialLinks?: SiteSocialLink[];
  defaultSeo: SeoFields;
  updatedAt?: string;
}

export interface HeroBadge {
  _type?: "badge";
  label: string;
  icon?: string;
}

export type HeroVariant = "split" | "centered" | "simple";

export interface HeroSection {
  _type: "heroSection";
  variant?: HeroVariant;
  kicker?: string;
  heading: string;
  subheading?: string;
  body?: PortableTextValue;
  primaryCta?: LinkValue;
  secondaryCta?: LinkValue;
  media?: SanityImage;
  badges?: HeroBadge[];
}

export interface FeatureItem {
  _type?: "feature";
  title: string;
  description: string;
  icon?: string;
  media?: SanityImage;
  link?: LinkValue;
}

export interface FeatureGridSection {
  _type: "featureGridSection";
  kicker?: string;
  title: string;
  intro?: string;
  columns?: number;
  features: FeatureItem[];
}

export interface TestimonialItem {
  _type?: "testimonial";
  quote: string;
  authorName: string;
  authorTitle?: string;
  company?: string;
  avatar?: SanityImage;
  logo?: SanityImage;
}

export type TestimonialsLayout = "carousel" | "grid" | "single";

export interface TestimonialsSection {
  _type: "testimonialsSection";
  title: string;
  intro?: string;
  layout?: TestimonialsLayout;
  testimonials: TestimonialItem[];
}

export type CtaTone = "primary" | "secondary" | "neutral";

export interface CtaSection {
  _type: "ctaSection";
  tone?: CtaTone;
  title: string;
  body?: PortableTextValue;
  primaryCta: LinkValue;
  secondaryCta?: LinkValue;
  media?: SanityImage;
}

export type RichTextLayout = "narrow" | "default" | "wide" | "twoColumn";

export interface RichTextSection {
  _type: "richTextSection";
  title?: string;
  layout?: RichTextLayout;
  content: PortableTextValue;
}

export interface FaqItem {
  _type?: "faq";
  question: string;
  answer: PortableTextValue;
}

export interface FaqSection {
  _type: "faqSection";
  title: string;
  intro?: string;
  faqs: FaqItem[];
}

export interface StatItem {
  _type?: "stat";
  label: string;
  value: string;
  description?: string;
  trend?: string;
  icon?: string;
}

export interface StatsSection {
  _type: "statsSection";
  title: string;
  intro?: string;
  stats: StatItem[];
}

export type ContactFieldType =
  | "text"
  | "email"
  | "company"
  | "phone"
  | "textarea"
  | "select";

export interface ContactFormField {
  _type?: "formField";
  name: string;
  label: string;
  type: ContactFieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface ContactFormSection {
  _type: "contactFormSection";
  title: string;
  intro?: PortableTextValue;
  formId?: string;
  recipientEmail?: string;
  submitLabel?: string;
  successMessage?: string;
  fields: ContactFormField[];
}

export type BasePageSection =
  | HeroSection
  | FeatureGridSection
  | TestimonialsSection
  | CtaSection
  | RichTextSection
  | FaqSection
  | StatsSection
  | ContactFormSection;

export type PageSection = BasePageSection | SanityReference<"reusableSection">;

export type ReusableSectionContent = BasePageSection;

export interface ReusableSectionDocument {
  _type: "reusableSection";
  title: string;
  description?: string;
  section: ReusableSectionContent[];
}

export interface PageDocument {
  _type: "page";
  _id?: string;
  title: string;
  slug: Slug;
  description?: string;
  sections?: PageSection[];
  seo?: SeoFields;
  createdAt?: string;
  updatedAt?: string;
  body?: PortableTextValue | string;
}

export interface AuthorDocument {
  _type: "author";
  _id?: string;
  name: string;
  slug: Slug;
  role?: string;
  headshot?: SanityImage;
  bio?: PortableTextValue;
  social?: SiteSocialLink[];
  email?: string;
  website?: string;
}

export interface CategoryDocument {
  _type: "category";
  _id?: string;
  title: string;
  slug: Slug;
  description?: string;
  order?: number;
}

export interface TagDocument {
  _type: "tag";
  _id?: string;
  title: string;
  slug: Slug;
  description?: string;
  order?: number;
}

export interface BlogPostDocument {
  _type: "blogPost";
  _id?: string;
  title: string;
  slug: Slug;
  excerpt: string;
  heroImage?: SanityImage;
  body: PortableTextValue | string;
  readingTime?: number;
  categories?: Array<CategoryDocument | SanityReference<"category">>;
  tags?: Array<TagDocument | SanityReference<"tag">>;
  author: AuthorDocument | SanityReference<"author">;
  seo?: SeoFields;
  publishedAt: string;
  updatedAt?: string;
  relatedPosts?: SanityReference<"blogPost">[];
}

export type BlogAuthor = AuthorDocument;
