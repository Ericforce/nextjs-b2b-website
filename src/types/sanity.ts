import type { PortableTextBlock } from "@portabletext/types";

export type SectionType =
  | "hero"
  | "featureGrid"
  | "callToAction"
  | "testimonials"
  | "richText";

export type CtaVariant = "primary" | "secondary" | "outline";

export interface SanityCta {
  label: string;
  href: string;
  variant?: CtaVariant;
  newTab?: boolean;
}

export interface SanityImage {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface BaseSection {
  _key: string;
  sectionType: SectionType;
  title?: string;
  eyebrow?: string;
  heading?: string;
  tagline?: string;
  description?: string;
  backgroundColor?: string;
}

export interface HeroSection extends BaseSection {
  sectionType: "hero";
  eyebrow?: string;
  heading?: string;
  description?: string;
  ctas?: SanityCta[];
  image?: SanityImage;
}

export interface FeatureGridItem {
  _key?: string;
  title?: string;
  description?: string;
  icon?: string;
}

export interface FeatureGridSection extends BaseSection {
  sectionType: "featureGrid";
  features?: FeatureGridItem[];
}

export interface CallToActionSection extends BaseSection {
  sectionType: "callToAction";
  primaryCta?: SanityCta | null;
  secondaryCta?: SanityCta | null;
}

export interface TestimonialItem {
  _key?: string;
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
  avatar?: SanityImage;
}

export interface TestimonialsSection extends BaseSection {
  sectionType: "testimonials";
  testimonials?: TestimonialItem[];
}

export interface RichTextSection extends BaseSection {
  sectionType: "richText";
  content?: PortableTextBlock[];
}

export type Section =
  | HeroSection
  | FeatureGridSection
  | CallToActionSection
  | TestimonialsSection
  | RichTextSection;

export interface ReusableSectionReference {
  _key: string;
  sectionType: "reusableReference";
  reusableSlug?: string;
  referenceId?: string;
  fallback?: Section;
}

export type SectionOrReference = Section | ReusableSectionReference;

export interface SanitySeo {
  title?: string;
  description?: string;
  keywords?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  ogImage?: SanityImage;
}

export interface SanityNavigationItem {
  label: string;
  href: string;
}

export interface SanityNavigationSettings {
  items?: SanityNavigationItem[];
  cta?: SanityCta | null;
}

export interface SanityFooterLink {
  label: string;
  href: string;
}

export interface SanityFooterSection {
  title?: string;
  links?: SanityFooterLink[];
}

export interface SanitySocialLink {
  label: string;
  href: string;
  icon?: string;
}

export interface SanityFooterSettings {
  sections?: SanityFooterSection[];
  social?: SanitySocialLink[];
  copyright?: string;
  description?: string;
}

export interface SanityBrandingSettings {
  name?: string;
  logo?: SanityImage;
  href?: string;
  tagline?: string;
}

export interface SanitySiteSettings {
  title?: string;
  description?: string;
  branding?: SanityBrandingSettings;
  navigation?: SanityNavigationSettings;
  footer?: SanityFooterSettings;
  seo?: SanitySeo;
}

export interface SanityPage {
  _id?: string;
  title?: string;
  slug?: string;
  seo?: SanitySeo;
  sections?: SectionOrReference[];
  reusableSections?: Section[];
}

export interface SanityReusableSection extends Section {
  slug?: string;
  _id?: string;
}
