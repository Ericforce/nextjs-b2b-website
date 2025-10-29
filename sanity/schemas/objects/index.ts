import type { SchemaTypeDefinition } from "sanity";

import { cta } from "./cta";
import { faqItem } from "./faqItem";
import { feature } from "./feature";
import { imageWithAlt } from "./imageWithAlt";
import { link } from "./link";
import { linkGroup } from "./linkGroup";
import { logoItem } from "./logoItem";
import { portableText } from "./portableText";
import { seo } from "./seo";
import { socialLinks } from "./socialLinks";
import { stat } from "./stat";
import { testimonial } from "./testimonial";

export const objectSchemas = [
  imageWithAlt,
  link,
  linkGroup,
  cta,
  stat,
  feature,
  testimonial,
  faqItem,
  logoItem,
  portableText,
  socialLinks,
  seo,
] satisfies SchemaTypeDefinition[];
