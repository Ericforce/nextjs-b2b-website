import { groq } from "next-sanity";

export const SITE_SETTINGS_QUERY = groq`
*[_type == "siteSettings"][0]{
  contactEmail,
  defaultSeo{
    title,
    description,
    openGraphImage{
      priority,
      image{
        asset-> {
          _id,
          url,
          metadata {
            lqip,
            dimensions
          }
        },
        alt,
        caption
      }
    }
  }
}`;

const BLOG_POST_CARD_FIELDS = groq`
{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  heroImage{
    priority,
    image{
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt,
      caption
    }
  },
  "categories": categories[]-> {
    _id,
    title,
    "slug": slug.current
  },
  "tags": tags[]-> {
    _id,
    title,
    "slug": slug.current
  },
  "authors": authors[]-> {
    _id,
    name,
    "slug": slug.current,
    image{
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      alt,
      caption
    },
    bio
  }
}`;

const BLOG_POST_FILTER = groq`
*[_type == "blogPost" && defined(slug.current)
  && (!defined($categorySlug) || $categorySlug in categories[]->slug.current)
  && (!defined($tagSlug) || $tagSlug in tags[]->slug.current)
  && (!defined($authorSlug) || $authorSlug in authors[]->slug.current)
]`;

export const PAGINATED_BLOG_POSTS_QUERY = groq`
{
  "total": count(${BLOG_POST_FILTER}),
  "posts": ${BLOG_POST_FILTER}
    | order(publishedAt desc, _createdAt desc)
    [$start...$end]${BLOG_POST_CARD_FIELDS}
}`;

export const BLOG_POST_SLUGS_QUERY = groq`
*[_type == "blogPost" && defined(slug.current)]{
  "slug": slug.current
}`;

export const BLOG_CATEGORY_SLUGS_QUERY = groq`
*[_type == "category" && defined(slug.current)]{
  "slug": slug.current
}`;

export const BLOG_TAG_SLUGS_QUERY = groq`
*[_type == "tag" && defined(slug.current)]{
  "slug": slug.current
}`;

export const BLOG_AUTHOR_SLUGS_QUERY = groq`
*[_type == "author" && defined(slug.current)]{
  "slug": slug.current
}`;

export const BLOG_POST_BY_SLUG_QUERY = groq`
*[_type == "blogPost" && slug.current == $slug][0]{
  ...${BLOG_POST_CARD_FIELDS},
  content,
  "plainText": pt::text(content),
  seo{
    title,
    description,
    openGraphImage{
      priority,
      image{
        asset-> {
          _id,
          url,
          metadata {
            lqip,
            dimensions
          }
        },
        alt,
        caption
      }
    }
  }
}`;

export const BLOG_CATEGORY_BY_SLUG_QUERY = groq`
*[_type == "category" && slug.current == $slug][0]{
  _id,
  title,
  description,
  "slug": slug.current
}`;

export const BLOG_TAG_BY_SLUG_QUERY = groq`
*[_type == "tag" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current
}`;

export const BLOG_AUTHOR_BY_SLUG_QUERY = groq`
*[_type == "author" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,
  image{
    asset-> {
      _id,
      url,
      metadata {
        lqip,
        dimensions
      }
    },
    alt,
    caption
  },
  bio
}`;
