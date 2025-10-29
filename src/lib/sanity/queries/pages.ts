import { groq } from "next-sanity";

const seoFields = groq`
  seo {
    title,
    description,
    keywords,
    noindex,
    nofollow,
    ogImage {
      "url": asset->url,
      "alt": alt,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  }
`;

const imageFields = groq`
  "url": asset->url,
  "alt": alt,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height
`;

const ctaFields = groq`
  label,
  href,
  variant,
  newTab
`;

const sectionFields = groq`
  _key,
  sectionType,
  title,
  eyebrow,
  heading,
  tagline,
  description,
  backgroundColor,
  sectionType == "hero" => {
    ctas[] {
      ${ctaFields}
    },
    image {
      ${imageFields}
    }
  },
  sectionType == "featureGrid" => {
    features[] {
      _key,
      title,
      description,
      icon
    }
  },
  sectionType == "callToAction" => {
    primaryCta {
      ${ctaFields}
    },
    secondaryCta {
      ${ctaFields}
    }
  },
  sectionType == "testimonials" => {
    testimonials[] {
      _key,
      quote,
      author,
      role,
      company,
      avatar {
        ${imageFields}
      }
    }
  },
  sectionType == "richText" => {
    content
  },
  sectionType == "reusableReference" => {
    reusableSlug,
    referenceId,
    fallback {
      ${sectionFields}
    }
  }
`;

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    ${seoFields},
    sections[] {
      ${sectionFields}
    },
    "reusableSections": *[_type == "reusableSection" && slug.current in ^.sections[sectionType == "reusableReference"].reusableSlug] {
      _id,
      "slug": slug.current,
      ${sectionFields}
    }
  }
`;

export const pagePathsQuery = groq`
  *[_type == "page" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    description,
    branding {
      name,
      logo {
        ${imageFields}
      },
      href,
      tagline
    },
    navigation {
      items[] {
        label,
        href
      },
      cta {
        ${ctaFields}
      }
    },
    footer {
      sections[] {
        title,
        links[] {
          label,
          href
        }
      },
      social[] {
        label,
        href,
        icon
      },
      copyright,
      description
    },
    ${seoFields}
  }
`;

export const reusableSectionBySlugQuery = groq`
  *[_type == "reusableSection" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    ${sectionFields}
  }
`;

export const reusableSectionsQuery = groq`
  *[_type == "reusableSection"] {
    _id,
    "slug": slug.current,
    ${sectionFields}
  }
`;
