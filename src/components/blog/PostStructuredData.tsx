import type { BlogPost } from "@/types/blog";
import { env } from "@/lib/env";
import { urlForImage } from "@/lib/sanity";

interface PostStructuredDataProps {
  post: BlogPost;
  url: string;
}

export default function PostStructuredData({
  post,
  url,
}: PostStructuredDataProps) {
  const imageBuilder = urlForImage(post.seo?.ogImage ?? post.coverImage);
  const imageUrl = imageBuilder
    ?.width(1600)
    .height(900)
    .fit("crop")
    .auto("format")
    .url();

  const publisherLogoUrl = `${env.app.url}/favicon.ico`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo?.description ?? post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: imageUrl ? [imageUrl] : undefined,
    author: post.author?.name
      ? {
          "@type": "Person",
          name: post.author.name,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "B2B App",
      logo: {
        "@type": "ImageObject",
        url: publisherLogoUrl,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
