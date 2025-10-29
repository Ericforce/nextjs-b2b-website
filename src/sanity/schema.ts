import type { SchemaTypeDefinition } from "sanity";

// Import document schemas
import {
  siteSettings,
  page,
  blogPost,
  author,
  category,
  tag,
  reusableSection,
} from "./documents";

// Import object schemas
import {
  navigationLink,
  callToAction,
  imageWithHotspot,
  seo,
  socialLinks,
  contactDetails,
  linkInternal,
  linkExternal,
  codeBlock,
} from "./objects";

// Import section schemas
import {
  heroSection,
  featureGridSection,
  testimonialSection,
  ctaSection,
  richTextSection,
  faqSection,
  statsSection,
  logoCloudSection,
  contactSection,
  reusableSectionReference,
} from "./sections";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  siteSettings,
  page,
  blogPost,
  author,
  category,
  tag,
  reusableSection,

  // Objects (these are referenced by documents and sections)
  navigationLink,
  callToAction,
  imageWithHotspot,
  seo,
  socialLinks,
  contactDetails,
  linkInternal,
  linkExternal,
  codeBlock,

  // Sections
  heroSection,
  featureGridSection,
  testimonialSection,
  ctaSection,
  richTextSection,
  faqSection,
  statsSection,
  logoCloudSection,
  contactSection,
  reusableSectionReference,
];
