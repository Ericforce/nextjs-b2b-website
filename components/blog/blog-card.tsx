import Image from "next/image";
import Link from "next/link";

import { formatDate } from "@/lib/datetime";
import { urlForImage } from "@/lib/sanity/image";
import type { BlogPostPreview } from "@/types/sanity";

interface BlogCardProps {
  post: BlogPostPreview;
}

function joinList(items: string[]): string {
  return items.filter(Boolean).join(", ");
}

export function BlogCard({ post }: BlogCardProps) {
  const hero = post.heroImage?.image;
  const heroBuilder = hero ? urlForImage(hero) : null;
  const heroUrl = heroBuilder?.width(800).height(480).fit("crop").url();
  const blur = hero?.asset?.metadata?.lqip;
  const width = hero?.asset?.metadata?.dimensions?.width ?? 800;
  const height = hero?.asset?.metadata?.dimensions?.height ?? 480;
  const authors = post.authors?.map((author) => author.name).filter(Boolean) ?? [];
  const categories = post.categories?.map((category) => category.title).filter(Boolean) ?? [];

  return (
    <article className="blog-card">
      <Link href={`/blog/${post.slug}`} className="blog-card__link" prefetch>
        {heroUrl ? (
          <div className="blog-card__media" aria-hidden="true">
            <Image
              src={heroUrl}
              alt={hero?.alt || post.title}
              width={width}
              height={height}
              sizes="(min-width: 1024px) 360px, (min-width: 768px) 45vw, 90vw"
              className="blog-card__image"
              placeholder={blur ? "blur" : undefined}
              blurDataURL={blur}
            />
          </div>
        ) : null}
        <div className="blog-card__content">
          <time dateTime={post.publishedAt} className="blog-card__meta">
            {formatDate(post.publishedAt)}
          </time>
          <h3 className="blog-card__title">{post.title}</h3>
          {post.excerpt ? <p className="blog-card__excerpt">{post.excerpt}</p> : null}
          <dl className="blog-card__details" aria-label="Post details">
            {authors.length > 0 ? (
              <div className="blog-card__detail" aria-label="Authors">
                <dt className="visually-hidden">Authors</dt>
                <dd>{joinList(authors)}</dd>
              </div>
            ) : null}
            {categories.length > 0 ? (
              <div className="blog-card__detail" aria-label="Categories">
                <dt className="visually-hidden">Categories</dt>
                <dd>{joinList(categories)}</dd>
              </div>
            ) : null}
          </dl>
          <span className="blog-card__cta" aria-hidden="true">
            Read more
          </span>
        </div>
      </Link>
      {post.tags && post.tags.length > 0 ? (
        <ul className="blog-card__tags" aria-label="Tags">
          {post.tags.map((tag) => (
            <li key={tag._id}>
              <Link href={`/blog/tag/${tag.slug}`} className="blog-card__tag">
                #{tag.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
