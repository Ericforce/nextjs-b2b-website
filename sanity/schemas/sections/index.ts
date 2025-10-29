import type { SchemaTypeDefinition } from "sanity";

import { ctaSection } from "./ctaSection";
import { faqSection } from "./faq";
import { featureGridSection } from "./featureGrid";
import { heroSection } from "./hero";
import { logoCloudSection } from "./logoCloud";
import { richTextSection } from "./richText";
import { statsSection } from "./stats";
import { testimonialsSection } from "./testimonials";

export const sectionSchemas = [
  heroSection,
  featureGridSection,
  ctaSection,
  testimonialsSection,
  richTextSection,
  logoCloudSection,
  faqSection,
  statsSection,
] satisfies SchemaTypeDefinition[];
