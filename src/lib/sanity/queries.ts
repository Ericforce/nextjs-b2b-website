import { groq } from "next-sanity";

const navigationLinkFields = groq`
  "label": coalesce(label, title, text, name),
  "href": select(
    defined(href) => href,
    defined(url) => url,
    defined(link) => link,
    defined(route) => route,
    defined(reference->slug.current) => select(
      reference->slug.current == "home" => "/",
      "/" + reference->slug.current
    ),
    "/"
  ),
  "reference": reference->{_id, _type, title, "slug": slug.current},
  "openInNewTab": coalesce(openInNewTab, newTab, target == "_blank", false)
`;

const callToActionFields = groq`
  "text": coalesce(text, label, title, name),
  "href": select(
    defined(href) => href,
    defined(link) => link,
    defined(url) => url,
    defined(route) => route,
    defined(reference->slug.current) => select(
      reference->slug.current == "home" => "/",
      "/" + reference->slug.current
    ),
    "/"
  ),
  "reference": reference->{_id, _type, title, "slug": slug.current},
  "variant": coalesce(variant, style, theme, "primary"),
  "openInNewTab": coalesce(openInNewTab, newTab, target == "_blank", false)
`;

const seoFields = groq`
{
  title,
  description,
  titleTemplate,
  canonical,
  noIndex,
  keywords,
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
  "ogImage": select(
    defined(ogImage.asset) => {
      "url": ogImage.asset->url,
      "width": ogImage.asset->metadata.dimensions.width,
      "height": ogImage.asset->metadata.dimensions.height,
      "alt": coalesce(ogImage.alt, ogImage.asset->altText)
    },
    defined(openGraphImage.asset) => {
      "url": openGraphImage.asset->url,
      "width": openGraphImage.asset->metadata.dimensions.width,
      "height": openGraphImage.asset->metadata.dimensions.height,
      "alt": coalesce(openGraphImage.alt, openGraphImage.asset->altText)
    }
  ),
  "twitterImage": select(
    defined(twitterImage.asset) => {
      "url": twitterImage.asset->url,
      "width": twitterImage.asset->metadata.dimensions.width,
      "height": twitterImage.asset->metadata.dimensions.height,
      "alt": coalesce(twitterImage.alt, twitterImage.asset->altText)
    },
    defined(ogImage.asset) => {
      "url": ogImage.asset->url,
      "width": ogImage.asset->metadata.dimensions.width,
      "height": ogImage.asset->metadata.dimensions.height,
      "alt": coalesce(ogImage.alt, ogImage.asset->altText)
    },
    defined(openGraphImage.asset) => {
      "url": openGraphImage.asset->url,
      "width": openGraphImage.asset->metadata.dimensions.width,
      "height": openGraphImage.asset->metadata.dimensions.height,
      "alt": coalesce(openGraphImage.alt, openGraphImage.asset->altText)
    }
  )
}
`;

const sectionBaseFields = groq`
  _key,
  _type,
  anchor,
  _type == "heroSection" => {
    "eyebrow": eyebrow,
    "headline": coalesce(headline, title),
    "subheadline": subheadline,
    "tagline": tagline,
    "description": description,
    "alignment": alignment,
    "backgroundColor": backgroundColor,
    "primaryCta": select(defined(primaryCTA) => primaryCTA{${callToActionFields}}),
    "secondaryCta": select(defined(secondaryCTA) => secondaryCTA{${callToActionFields}}),
    "backgroundImage": select(
      defined(backgroundImage.asset) => {
        "url": backgroundImage.asset->url,
        "width": backgroundImage.asset->metadata.dimensions.width,
        "height": backgroundImage.asset->metadata.dimensions.height,
        "alt": coalesce(backgroundImage.alt, backgroundImage.asset->altText)
      }
    ),
    "mediaImage": select(
      defined(media.image.asset) => {
        "url": media.image.asset->url,
        "width": media.image.asset->metadata.dimensions.width,
        "height": media.image.asset->metadata.dimensions.height,
        "alt": coalesce(media.image.alt, media.image.asset->altText)
      }
    )
  },
  _type == "featureGridSection" => {
    "headline": headline,
    "description": description,
    "columns": columns,
    "features": features[]{
      _key,
      title,
      description,
      icon,
      "image": select(
        defined(image.asset) => {
          "url": image.asset->url,
          "width": image.asset->metadata.dimensions.width,
          "height": image.asset->metadata.dimensions.height,
          "alt": coalesce(image.alt, image.asset->altText)
        }
      )
    }
  },
  _type == "ctaSection" => {
    "headline": headline,
    "description": description,
    "alignment": alignment,
    "backgroundColor": backgroundColor,
    "primaryCta": select(
      defined(button) => button{${callToActionFields}},
      defined(primaryCTA) => primaryCTA{${callToActionFields}},
      defined(cta) => cta{${callToActionFields}}
    ),
    "secondaryCta": select(
      defined(secondaryCTA) => secondaryCTA{${callToActionFields}}
    )
  },
  _type == "testimonialSection" => {
    "headline": headline,
    "description": description,
    "layout": layout,
    "testimonials": testimonials[]{
      _key,
      quote,
      author,
      role,
      company,
      rating,
      "image": select(
        defined(image.asset) => {
          "url": image.asset->url,
          "width": image.asset->metadata.dimensions.width,
          "height": image.asset->metadata.dimensions.height,
          "alt": coalesce(image.alt, image.asset->altText)
        }
      ),
      "logo": select(
        defined(logo.asset) => {
          "url": logo.asset->url,
          "width": logo.asset->metadata.dimensions.width,
          "height": logo.asset->metadata.dimensions.height,
          "alt": coalesce(logo.alt, logo.asset->altText, company)
        }
      )
    }
  },
  _type == "richTextSection" => {
    "headline": headline,
    "backgroundColor": backgroundColor,
    "width": width,
    "content": content[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => {
          ...,
          "slug": reference->slug.current
        }
      }
    }
  },
  _type == "faqSection" => {
    "headline": headline,
    "layout": layout,
    "faqs": faqs[]{
      _key,
      question,
      answer[]{
        ...,
        markDefs[]{
          ...,
          _type == "internalLink" => {
            ...,
            "slug": reference->slug.current
          }
        }
      }
    }
  },
  _type == "statsSection" => {
    "headline": headline,
    "description": description,
    "stats": stats[]{
      _key,
      value,
      label,
      icon
    }
  },
  _type == "logoCloudSection" => {
    "headline": headline,
    "grayscale": grayscale,
    "logos": logos[]{
      _key,
      "href": select(
        defined(href) => href,
        defined(link) => link,
        defined(url) => url
      ),
      "image": select(
        defined(image.asset) => {
          "url": image.asset->url,
          "width": image.asset->metadata.dimensions.width,
          "height": image.asset->metadata.dimensions.height,
          "alt": coalesce(image.alt, image.asset->altText)
        }
      )
    }
  },
  _type == "contactSection" => {
    "eyebrow": eyebrow,
    "headline": headline,
    "description": description,
    "backgroundColor": backgroundColor,
    "showForm": coalesce(showForm, true),
    "contactDetails": contactDetails[]{
      _key,
      label,
      value,
      icon,
      "href": coalesce(href, link, url)
    }
  }
`;

const sectionFields = groq`
  ${sectionBaseFields},
  _type == "reusableSection" => {
    title,
    "sections": sections[]{
      ${sectionBaseFields}
    }
  },
  _type == "reusableSectionReference" => {
    "section": reference->{
      _id,
      title,
      "sections": sections[]{
        ${sectionBaseFields}
      }
    }
  }
`;

export const siteSettingsQuery = groq`
*[_type == "siteSettings"][0]{
  _id,
  _type,
  title,
  description,
  locale,
  siteUrl,
  "contactEmail": coalesce(contactEmail, email),
  "updatedAt": coalesce(_updatedAt, _createdAt),
  "logo": select(
    defined(logo.asset) => {
      "url": logo.asset->url,
      "width": logo.asset->metadata.dimensions.width,
      "height": logo.asset->metadata.dimensions.height,
      "alt": coalesce(logo.alt, logo.asset->altText)
    }
  ),
  "favicon": select(
    defined(favicon.asset) => favicon.asset->url
  ),
  "defaultSeo": defaultSeo{
    ${seoFields}
  },
  "mainNavigation": mainNavigation[]{
    ${navigationLinkFields}
  },
  "secondaryNavigation": secondaryNavigation[]{
    ${navigationLinkFields}
  },
  "headerCTA": headerCTA{
    ${callToActionFields}
  },
  "footerSections": footerSections[]{
    title,
    links[]{
      ${navigationLinkFields}
    }
  },
  "socialLinks": socialLinks{
    twitter,
    linkedin,
    github,
    youtube,
    facebook,
    instagram
  },
  "copyrightText": copyrightText
}
`;

export const allPagesQuery = groq`
*[_type == "page" && defined(slug.current)] | order(_updatedAt desc){
  _id,
  _type,
  title,
  description,
  "slug": slug.current,
  "createdAt": coalesce(publishedAt, _createdAt),
  "updatedAt": coalesce(_updatedAt, publishedAt, _createdAt),
  seo ${seoFields}
}
`;

export const pageSlugsQuery = groq`
*[_type == "page" && defined(slug.current)]{
  "slug": slug.current
}
`;

export const pageBySlugQuery = groq`
*[_type == "page" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  description,
  "slug": slug.current,
  "createdAt": coalesce(publishedAt, _createdAt),
  "updatedAt": coalesce(_updatedAt, publishedAt, _createdAt),
  seo ${seoFields},
  sections[]{
    ${sectionFields}
  }
}
`;

export const reusableSectionsQuery = groq`
*[_type == "reusableSection"]{
  _id,
  title,
  description,
  "sections": sections[]{
    ${sectionBaseFields}
  }
}
`;

export const allBlogPostsQuery = groq`
*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){
  _id,
  _type,
  title,
  "slug": slug.current,
  excerpt,
  "featuredImage": select(
    defined(featuredImage.asset) => {
      "url": featuredImage.asset->url,
      "width": featuredImage.asset->metadata.dimensions.width,
      "height": featuredImage.asset->metadata.dimensions.height,
      "alt": coalesce(featuredImage.alt, featuredImage.asset->altText)
    }
  ),
  "publishedAt": coalesce(publishedAt, _createdAt),
  "updatedAt": _updatedAt,
  "author": author->{_id, name, "slug": slug.current, image},
  "categories": categories[]->{_id, title, "slug": slug.current, color},
  "tags": tags[]->{_id, title, "slug": slug.current, color},
  seo ${seoFields}
}
`;

export const blogPostSlugsQuery = groq`
*[_type == "blogPost" && defined(slug.current)]{
  "slug": slug.current
}
`;

export const blogPostBySlugQuery = groq`
*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  "slug": slug.current,
  excerpt,
  "featuredImage": select(
    defined(featuredImage.asset) => {
      "url": featuredImage.asset->url,
      "width": featuredImage.asset->metadata.dimensions.width,
      "height": featuredImage.asset->metadata.dimensions.height,
      "alt": coalesce(featuredImage.alt, featuredImage.asset->altText)
    }
  ),
  body[]{
    ...,
    markDefs[]{
      ...,
      _type == "linkInternal" => {
        ...,
        "reference": reference->{_id, _type, title, "slug": slug.current}
      }
    }
  },
  "publishedAt": coalesce(publishedAt, _createdAt),
  "createdAt": _createdAt,
  "updatedAt": _updatedAt,
  "author": author->{_id, name, "slug": slug.current, bio, image, website, email, socialLinks},
  "categories": categories[]->{_id, title, "slug": slug.current, description, color, icon},
  "tags": tags[]->{_id, title, "slug": slug.current, description, color},
  seo ${seoFields}
}
`;

export const allAuthorsQuery = groq`
*[_type == "author" && defined(slug.current)] | order(name asc){
  _id,
  name,
  "slug": slug.current,
  bio,
  "image": select(
    defined(image.asset) => {
      "url": image.asset->url,
      "width": image.asset->metadata.dimensions.width,
      "height": image.asset->metadata.dimensions.height,
      "alt": coalesce(image.alt, image.asset->altText)
    }
  ),
  website,
  email,
  socialLinks
}
`;

export const authorBySlugQuery = groq`
*[_type == "author" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  bio,
  "image": select(
    defined(image.asset) => {
      "url": image.asset->url,
      "width": image.asset->metadata.dimensions.width,
      "height": image.asset->metadata.dimensions.height,
      "alt": coalesce(image.alt, image.asset->altText)
    }
  ),
  website,
  email,
  socialLinks
}
`;

export const allCategoriesQuery = groq`
*[_type == "category" && defined(slug.current)] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  description,
  color,
  icon
}
`;

export const categoryBySlugQuery = groq`
*[_type == "category" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  color,
  icon
}
`;

export const allTagsQuery = groq`
*[_type == "tag" && defined(slug.current)] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  description,
  color
}
`;

export const tagBySlugQuery = groq`
*[_type == "tag" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  color
}
`;
