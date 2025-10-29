import { groq } from "next-sanity";

const IMAGE_WITH_METADATA = groq`
  ...,
  "alt": coalesce(alt, asset->altText),
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions,
`;

const AUTHOR_SELECTION = groq`
  _id,
  name,
  "slug": slug.current,
  title,
  bio,
  "image": image{${IMAGE_WITH_METADATA}},
  "social": {
    website,
    twitter,
    linkedin,
    github,
  }
`;

const TAXONOMY_SELECTION = groq`
  _id,
  title,
  "slug": slug.current,
  description
`;

const SEO_SELECTION = groq`
  "title": coalesce(seo.title, seoTitle, title),
  "description": coalesce(seo.description, seoDescription, excerpt),
  "canonical": coalesce(seo.canonical, canonical),
  "noIndex": coalesce(seo.noIndex, false),
  "keywords": coalesce(seo.keywords, keywords),
  "ogTitle": coalesce(seo.ogTitle, seo.title, seoTitle, title),
  "ogDescription": coalesce(
    seo.ogDescription,
    seo.description,
    seoDescription,
    excerpt
  ),
  "ogImage": select(
    defined(coalesce(seo.ogImage, openGraphImage).asset) => {
      "url": coalesce(seo.ogImage, openGraphImage).asset->url,
      "alt": coalesce(
        coalesce(seo.ogImage, openGraphImage).alt,
        coalesce(seo.ogImage, openGraphImage).asset->altText
      ),
      "width": coalesce(seo.ogImage, openGraphImage).asset->metadata.dimensions.width,
      "height": coalesce(seo.ogImage, openGraphImage).asset->metadata.dimensions.height,
      "lqip": coalesce(seo.ogImage, openGraphImage).asset->metadata.lqip,
    }
  ),
  "twitterTitle": coalesce(seo.twitterTitle, seo.ogTitle, seoTitle, title),
  "twitterDescription": coalesce(
    seo.twitterDescription,
    seo.ogDescription,
    seoDescription,
    excerpt
  ),
  "twitterImage": select(
    defined(seo.twitterImage.asset) => {
      "url": seo.twitterImage.asset->url,
      "alt": coalesce(seo.twitterImage.alt, seo.twitterImage.asset->altText),
      "width": seo.twitterImage.asset->metadata.dimensions.width,
      "height": seo.twitterImage.asset->metadata.dimensions.height,
      "lqip": seo.twitterImage.asset->metadata.lqip,
    }
  )
`;

const BLOG_POST_SELECTION = groq`
  _id,
  "slug": slug.current,
  title,
  excerpt,
  "publishedAt": coalesce(publishedAt, _createdAt),
  "updatedAt": coalesce(_updatedAt, publishedAt, _createdAt),
  "mainImage": mainImage{${IMAGE_WITH_METADATA}},
  "mainImageUrl": mainImage.asset->url,
  "author": author->{${AUTHOR_SELECTION}},
  "categories": categories[]->{${TAXONOMY_SELECTION}},
  "tags": tags[]->{${TAXONOMY_SELECTION}},
  "readingTimeMinutes": coalesce(readingTime.minutes, readingTime, null),
  "seo": {${SEO_SELECTION}}
`;

export const BLOG_POST_SUMMARY_FIELDS = groq`{${BLOG_POST_SELECTION}}`;

export const BLOG_POST_DETAIL_FIELDS = groq`{
  ${BLOG_POST_SELECTION},
  body[]{
    ...,
    markDefs[]{
      ...,
      _type == "internalLink" => {
        ...,
        "slug": reference->slug.current,
        "_type": reference->_type,
        "title": coalesce(reference->title, reference->name)
      }
    }
  }
}`;

const publishedPostFilter = groq`
  _type == "blogPost" &&
  defined(slug.current) &&
  (
    $isPreview == true ||
    (defined(publishedAt) && publishedAt <= now())
  ) &&
  (!defined($category) || $category == "" || $category in categories[]->slug.current) &&
  (!defined($tag) || $tag == "" || $tag in tags[]->slug.current) &&
  (!defined($author) || $author == "" || author->slug.current == $author) &&
  (!defined($excludeSlug) || $excludeSlug != slug.current)
`;

export const BLOG_INDEX_QUERY = groq`
{
  "posts": *[${publishedPostFilter}] | order(publishedAt desc, _createdAt desc)[$offset...$rangeEnd] {
    ${BLOG_POST_SUMMARY_FIELDS}
  },
  "totalCount": count(*[${publishedPostFilter}]),
  "categories": *[_type in ["category", "blogCategory"] && defined(slug.current)] | order(title asc) {
    ${TAXONOMY_SELECTION},
    "postCount": count(*[
      _type == "blogPost" &&
      defined(slug.current) &&
      references(^._id) &&
      (
        $isPreview == true ||
        (defined(publishedAt) && publishedAt <= now())
      )
    ])
  },
  "tags": *[_type in ["tag", "blogTag"] && defined(slug.current)] | order(title asc) {
    ${TAXONOMY_SELECTION},
    "postCount": count(*[
      _type == "blogPost" &&
      defined(slug.current) &&
      references(^._id) &&
      (
        $isPreview == true ||
        (defined(publishedAt) && publishedAt <= now())
      )
    ])
  }
}`;

export const BLOG_POST_BY_SLUG_QUERY = groq`
*[_type == "blogPost" && slug.current == $slug][0] {
  ${BLOG_POST_DETAIL_FIELDS},
  "relatedPosts": *[${publishedPostFilter} && slug.current != $slug && (
    count((categories[]->slug.current)[@ in ^.categories[]->slug.current]) > 0 ||
    count((tags[]->slug.current)[@ in ^.tags[]->slug.current]) > 0
  )] | order(publishedAt desc, _createdAt desc)[0...3] {
    ${BLOG_POST_SUMMARY_FIELDS}
  }
}`;

export const BLOG_AUTHOR_QUERY = groq`
{
  "author": *[_type == "author" && slug.current == $slug][0]{${AUTHOR_SELECTION}},
  "posts": *[${publishedPostFilter} && author->slug.current == $slug] | order(publishedAt desc, _createdAt desc)[$offset...$rangeEnd] {
    ${BLOG_POST_SUMMARY_FIELDS}
  },
  "totalCount": count(*[${publishedPostFilter} && author->slug.current == $slug])
}`;

export const BLOG_CATEGORY_QUERY = groq`
{
  "taxonomy": *[_type in ["category", "blogCategory"] && slug.current == $slug][0]{${TAXONOMY_SELECTION}},
  "posts": *[${publishedPostFilter} && $slug in categories[]->slug.current] | order(publishedAt desc, _createdAt desc)[$offset...$rangeEnd] {
    ${BLOG_POST_SUMMARY_FIELDS}
  },
  "totalCount": count(*[${publishedPostFilter} && $slug in categories[]->slug.current])
}`;

export const BLOG_TAG_QUERY = groq`
{
  "taxonomy": *[_type in ["tag", "blogTag"] && slug.current == $slug][0]{${TAXONOMY_SELECTION}},
  "posts": *[${publishedPostFilter} && $slug in tags[]->slug.current] | order(publishedAt desc, _createdAt desc)[$offset...$rangeEnd] {
    ${BLOG_POST_SUMMARY_FIELDS}
  },
  "totalCount": count(*[${publishedPostFilter} && $slug in tags[]->slug.current])
}`;

export const BLOG_POST_SLUGS_QUERY = groq`
  *[_type == "blogPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] {
    "slug": slug.current
  }
`;

export const BLOG_CATEGORY_SLUGS_QUERY = groq`
  *[_type in ["category", "blogCategory"] && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const BLOG_TAG_SLUGS_QUERY = groq`
  *[_type in ["tag", "blogTag"] && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const BLOG_AUTHOR_SLUGS_QUERY = groq`
  *[_type == "author" && defined(slug.current)] {
    "slug": slug.current
  }
`;

export const BLOG_POST_SITEMAP_QUERY = groq`
  *[_type == "blogPost" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
    "slug": slug.current,
    "publishedAt": coalesce(publishedAt, _createdAt),
    "updatedAt": coalesce(_updatedAt, publishedAt, _createdAt),
    "canonical": coalesce(seo.canonical, canonical)
  }
`;
