import type {
  SanityPage,
  SanityReusableSection,
  Section,
  SectionOrReference,
} from "@/types/sanity";

export function resolvePageSections(
  page: SanityPage | null,
  reusableSections: Record<string, SanityReusableSection> = {}
): Section[] {
  if (!page) {
    return [];
  }

  const resolved: Section[] = [];
  const inlineSections = Array.isArray(page.sections) ? page.sections : [];
  const pageReusable = Array.isArray(page.reusableSections)
    ? page.reusableSections
    : [];

  const reusableBySlug = new Map<string, SanityReusableSection>();
  Object.entries(reusableSections).forEach(([slug, section]) => {
    if (slug) {
      reusableBySlug.set(slug, section);
    }
  });

  pageReusable.forEach((section) => {
    if (section.slug) {
      reusableBySlug.set(section.slug, section);
    }
  });

  inlineSections.forEach((section) => {
    if (!section) {
      return;
    }

    if (isReusableReference(section)) {
      const slug = section.reusableSlug || "";
      if (reusableBySlug.has(slug)) {
        resolved.push(reusableBySlug.get(slug)!);
      } else if (section.fallback) {
        resolved.push(section.fallback);
      }
      return;
    }

    resolved.push(section as Section);
  });

  if (resolved.length === 0 && pageReusable.length > 0) {
    resolved.push(...pageReusable);
  }

  return resolved;
}

function isReusableReference(section: SectionOrReference): section is {
  _key: string;
  sectionType: "reusableReference";
  reusableSlug?: string;
  fallback?: Section;
} {
  return section.sectionType === "reusableReference";
}
