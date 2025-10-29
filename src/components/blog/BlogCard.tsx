import Image from "next/image";
import Link from "next/link";
import type { BlogPostSummary } from "@/types/blog";
import { formatDate } from "@/lib/utils";
import { urlForImage } from "@/lib/sanity";

interface BlogCardProps {
  post: BlogPostSummary;
}

export default function BlogCard({ post }: BlogCardProps) {
  const href = `/blog/${post.slug}`;
  const imageBuilder = urlForImage(post.coverImage);
  const imageUrl = imageBuilder
    ?.width(800)
    .height(500)
    .fit("crop")
    .auto("format")
    .url();

  const primaryCategory = post.categories?.[0];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft transition-shadow hover:shadow-medium">
      <Link href={href} className="relative block aspect-[16/10] w-full overflow-hidden bg-secondary-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.coverImage?.alt || post.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary-100 text-secondary-500">
            <span className="text-sm font-semibold uppercase tracking-wide">
              {primaryCategory?.title || "Featured"}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-primary-600">
          {primaryCategory && (
            <Link
              href={{ pathname: "/blog", query: { category: primaryCategory.slug } }}
              className="hover:text-primary-700"
            >
              {primaryCategory.title}
            </Link>
          )}
          {post.publishedAt && (
            <span className="font-normal text-secondary-500">
              {formatDate(post.publishedAt)}
            </span>
          )}
          {post.estimatedReadingTime > 0 && (
            <span className="font-normal text-secondary-500">
              {post.estimatedReadingTime} min read
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight text-secondary-900">
            <Link href={href} className="transition-colors hover:text-primary-600">
              {post.title}
            </Link>
          </h3>
          {post.excerpt && (
            <p className="line-clamp-3 text-sm text-secondary-600">{post.excerpt}</p>
          )}
        </div>

        {post.tags?.length ? (
          <div className="mt-auto flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                href={{ pathname: "/blog", query: { tag: tag.slug } }}
                className="inline-flex items-center rounded-full bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-600 transition-colors hover:bg-primary-50 hover:text-primary-600"
              >
                #{tag.title}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-6">
          <Link
            href={href}
            className="inline-flex items-center text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            Read more
            <svg
              className="ml-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 5l8 7-8 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
