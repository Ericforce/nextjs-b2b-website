import { groq } from 'next-sanity';

export const PAGE_SLUGS_QUERY = groq`
  *[_type == "page" && defined(slug.current)]{
    "segments": select(
      slug.current in ["", "/", "home"] => [],
      slug.current match "^/" => array::compact(split(slug.current, "/")),
      slug.current match "/" => array::compact(split(slug.current, "/")),
      slug.current => [slug.current]
    )
  }
`;

export const PAGE_BY_SLUG_QUERY = groq`
  *[_type == "page" && slug.current in $slugs][0]{
    _id,
    _type,
    title,
    slug,
    description,
    seo,
    sections[] {
      _key,
      "_type": select(
        _type in ["hero", "heroSection"] => "hero",
        _type in ["features", "featureSection", "featuresSection"] => "features",
        _type in ["testimonials", "testimonialSection", "testimonialsSection"] => "testimonials",
        _type in ["cta", "ctaSection", "callToActionSection"] => "cta",
        _type in ["richText", "richTextSection", "portableTextSection"] => "richText",
        _type in ["stats", "statSection", "metricsSection"] => "stats",
        _type in ["faq", "faqSection"] => "faq",
        defined(sectionType) => sectionType,
        _type
      ),
      eyebrow,
      heading,
      subheading,
      content,
      layout,
      "cta": coalesce(cta->{
        label,
        href
      }, cta{
        label,
        href
      }),
      "secondaryCta": coalesce(secondaryCta->{
        label,
        href
      }, secondaryCta{
        label,
        href
      }),
      items[] {
        _key,
        title,
        subtitle,
        description,
        icon,
        stat,
        value
      },
      faqs[] {
        _key,
        question,
        answer
      },
      testimonials[] {
        _key,
        quote,
        name,
        title,
        avatar {
          asset-> {
            _id,
            url,
            metadata
          },
          alt
        }
      },
      "image": image{
        asset-> {
          _id,
          url,
          metadata
        },
        alt
      }
    }
  }
`;
