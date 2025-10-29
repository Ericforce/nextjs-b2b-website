// Schema type constants to ensure consistency across the codebase
export const SCHEMA_TYPES = {
  // Documents
  SITE_SETTINGS: "siteSettings",
  PAGE: "page",
  BLOG_POST: "blogPost",
  AUTHOR: "author",
  CATEGORY: "category",
  TAG: "tag",
  REUSABLE_SECTION: "reusableSection",

  // Sections
  HERO_SECTION: "heroSection",
  FEATURE_GRID_SECTION: "featureGridSection",
  TESTIMONIAL_SECTION: "testimonialSection",
  CTA_SECTION: "ctaSection",
  RICH_TEXT_SECTION: "richTextSection",
  FAQ_SECTION: "faqSection",
  STATS_SECTION: "statsSection",
  LOGO_CLOUD_SECTION: "logoCloudSection",
  CONTACT_SECTION: "contactSection",
  REUSABLE_SECTION_REFERENCE: "reusableSectionReference",

  // Objects
  NAVIGATION_LINK: "navigationLink",
  CALL_TO_ACTION: "callToAction",
  IMAGE_WITH_HOTSPOT: "imageWithHotspot",
  SEO: "seo",
  SOCIAL_LINKS: "socialLinks",
  CONTACT_DETAILS: "contactDetails",
  LINK_INTERNAL: "linkInternal",
  LINK_EXTERNAL: "linkExternal",
  CODE_BLOCK: "codeBlock",
} as const;

// Section type constants
export const SECTION_TYPES = {
  HERO: "heroSection",
  FEATURE_GRID: "featureGridSection",
  TESTIMONIAL: "testimonialSection",
  CTA: "ctaSection",
  RICH_TEXT: "richTextSection",
  FAQ: "faqSection",
  STATS: "statsSection",
  LOGO_CLOUD: "logoCloudSection",
  CONTACT: "contactSection",
  REUSABLE: "reusableSection",
  REUSABLE_REFERENCE: "reusableSectionReference",
} as const;

// CTA variant constants
export const CTA_VARIANTS = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  GHOST: "ghost",
  LINK: "link",
} as const;

// Alignment constants
export const ALIGNMENTS = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;

// Layout constants
export const LAYOUTS = {
  CAROUSEL: "carousel",
  GRID: "grid",
  SINGLE: "single",
  SINGLE_COLUMN: "single-column",
  TWO_COLUMN: "two-column",
} as const;

// Width constants
export const WIDTHS = {
  NARROW: "narrow",
  MEDIUM: "medium",
  FULL: "full",
} as const;

// Type guards
export function isPageSection(
  section: unknown
): section is import("../../types/sanity").PageSection {
  return (
    section &&
    typeof section === "object" &&
    "_type" in section &&
    "_key" in section
  );
}

export function isCallToAction(
  obj: unknown
): obj is import("../../types/sanity").CallToAction {
  return obj && typeof obj === "object" && "text" in obj;
}

export function isNavigationLink(
  obj: unknown
): obj is import("../../types/sanity").NavigationLink {
  return obj && typeof obj === "object" && "label" in obj;
}
