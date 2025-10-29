import type { ComponentType, ReactNode } from "react";

import type {
  PageSection,
  ReusableSection,
  ReusableSectionReference,
} from "@/types";

import { CallToActionSection as CallToAction } from "./CallToActionSection";
import { ContactSection as Contact } from "./ContactSection";
import { FeatureGridSection as FeatureGrid } from "./FeatureGridSection";
import { HeroSection as Hero } from "./HeroSection";
import { LogoCloudSection as LogoCloud } from "./LogoCloudSection";
import { RichTextSection as RichText } from "./RichTextSection";
import { FaqSection as Faq } from "./FaqSection";
import { StatsSection as Stats } from "./StatsSection";
import { TestimonialsSection as Testimonials } from "./TestimonialsSection";

const SECTION_COMPONENTS: Record<string, ComponentType<any>> = {
  heroSection: Hero,
  featureGridSection: FeatureGrid,
  testimonialSection: Testimonials,
  ctaSection: CallToAction,
  richTextSection: RichText,
  faqSection: Faq,
  statsSection: Stats,
  logoCloudSection: LogoCloud,
  contactSection: Contact,
};

const isDev = process.env.NODE_ENV !== "production";

function warn(message: string, meta?: unknown) {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.warn(message, meta);
  }
}

function isReusableSection(section: PageSection): section is ReusableSection {
  return section._type === "reusableSection";
}

function isReusableReference(
  section: PageSection
): section is ReusableSectionReference {
  return section._type === "reusableSectionReference";
}

interface SectionRendererProps {
  sections?: PageSection[] | null;
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  const visited = new Set<string>();

  function renderSectionList(
    items: PageSection[] | undefined,
    ancestry: string[] = []
  ): ReactNode[] {
    if (!items || items.length === 0) {
      return [];
    }

    return items.flatMap((section, index) => {
      if (!section?._type) {
        warn("Encountered section without _type", section);
        return [];
      }

      if (isReusableSection(section)) {
        const reusableKey =
          section._key ?? `reusable-${ancestry.join("-")}-${index}`;
        if (visited.has(reusableKey)) {
          warn("Detected circular reusable section", reusableKey);
          return [];
        }

        visited.add(reusableKey);
        const rendered = renderSectionList(section.sections ?? [], [
          ...ancestry,
          reusableKey,
        ]);
        visited.delete(reusableKey);
        return rendered;
      }

      if (isReusableReference(section)) {
        const referenced = section.section;
        if (!referenced) {
          warn("Reusable section reference missing target", section);
          return [];
        }

        const referenceKey =
          referenced._id ??
          section._key ??
          `${referenced.title ?? "reusable"}-${ancestry.join("-")}-${index}`;

        if (visited.has(referenceKey)) {
          warn("Detected circular reusable section reference", referenceKey);
          return [];
        }

        visited.add(referenceKey);
        const rendered = renderSectionList(referenced.sections ?? [], [
          ...ancestry,
          referenceKey,
        ]);
        visited.delete(referenceKey);
        return rendered;
      }

      const Component = SECTION_COMPONENTS[section._type];

      if (!Component) {
        warn(`No renderer registered for section type: ${section._type}`);
        return [];
      }

      const key =
        section._key ?? `${section._type}-${index}-${ancestry.join("-")}`;

      return [<Component key={key} {...section} />];
    });
  }

  const renderedSections = renderSectionList(sections ?? []);

  if (renderedSections.length === 0) {
    return null;
  }

  return <>{renderedSections}</>;
}
