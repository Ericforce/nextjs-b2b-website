import { defineArrayMember } from "sanity";

import { contactFormSection } from "./contactFormSection";
import { ctaSection } from "./ctaSection";
import { faqSection } from "./faqSection";
import { featureGridSection } from "./featureGridSection";
import { heroSection } from "./heroSection";
import { richTextSection } from "./richTextSection";
import { statsSection } from "./statsSection";
import { testimonialsSection } from "./testimonialsSection";

export const sectionObjects = [
  heroSection,
  featureGridSection,
  testimonialsSection,
  ctaSection,
  richTextSection,
  faqSection,
  statsSection,
  contactFormSection,
];

const baseSectionMembers = [
  defineArrayMember({ type: "heroSection" }),
  defineArrayMember({ type: "featureGridSection" }),
  defineArrayMember({ type: "testimonialsSection" }),
  defineArrayMember({ type: "ctaSection" }),
  defineArrayMember({ type: "richTextSection" }),
  defineArrayMember({ type: "faqSection" }),
  defineArrayMember({ type: "statsSection" }),
  defineArrayMember({ type: "contactFormSection" }),
];

export const sectionArrayMembers = [
  ...baseSectionMembers,
  defineArrayMember({
    name: "reusableSectionRef",
    title: "Reusable section",
    type: "reference",
    to: [{ type: "reusableSection" }],
    options: {
      disableNew: true,
      weak: true,
    },
  }),
];

export const reusableSectionMembers = baseSectionMembers;
