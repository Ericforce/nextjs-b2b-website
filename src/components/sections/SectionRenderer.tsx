import React from "react";
import type { Section } from "@/types/sanity";
import HeroSection from "./HeroSection";
import FeatureGridSection from "./FeatureGridSection";
import CallToActionSection from "./CallToActionSection";
import TestimonialsSection from "./TestimonialsSection";
import RichTextSection from "./RichTextSection";

interface SectionRendererProps {
  sections: Section[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
  if (!Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section) => {
        if (!section?._key || !section.sectionType) {
          return null;
        }

        const Component = getSectionComponent(section.sectionType);

        if (!Component) {
          console.warn(`Unknown section type: ${section.sectionType}`);
          return null;
        }

        return <Component key={section._key} section={section} />;
      })}
    </>
  );
}

function getSectionComponent(sectionType: string) {
  const components: Record<
    string,
    React.ComponentType<{ section: Section }>
  > = {
    hero: HeroSection,
    featureGrid: FeatureGridSection,
    callToAction: CallToActionSection,
    testimonials: TestimonialsSection,
    richText: RichTextSection,
  };

  return components[sectionType] || null;
}
