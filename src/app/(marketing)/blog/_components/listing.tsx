import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/format";
import type { BlogPostDocument } from "@/types";

interface BlogCardProps {
  post: BlogPostDocument;
}

export function BlogCard({ post }: BlogCardProps) {
  const readingTime =
    post.readingTime ??
    (post.readingTimeMinutes
      ? `${Math.max(1, Math.round(post.readingTimeMinutes))} min read`
      : undefined);

  const excerpt =
    post.excerpt ?? post.seo?.description ?? "Fresh insights from our team.";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-secondary-200 bg-white transition-shadow hover:shadow-lg">
      {post.featuredImage?.url ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt ?? post.title}
            fill
            sizes="(min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            placeholder={post.featuredImage.lqip ? "blur" : undefined}
            blurDataURL={post.featuredImage.lqip}
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary-600">
          <span>{formatDate(post.publishedAt)}</span>
          {readingTime ? (
            <>
              <span>•</span>
              <span>{readingTime}</span>
            </>
          ) : null}
        </div>
        <h2 className="mt-3 text-2xl font-semibold leading-snug text-secondary-900">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-primary-600"
          >
            {post.title}
          </Link>
        </h2>
        {excerpt ? <p className="mt-3 text-secondary-600">{excerpt}</p> : null}
        {post.categories.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                prefetch={false}
                className="rounded-full bg-secondary-100 px-3 py-1 text-xs font-medium text-secondary-700 transition-colors hover:bg-primary-100 hover:text-primary-700"
              >
                {category.title}
              </Link>
            ))}
          </div>
        ) : null}
        <div className="mt-auto pt-6 text-sm text-secondary-500">
          {post.author?.name ? `By ${post.author.name}` : "\u00a0"}
        </div>
      </div>
    </article>
  );
}

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  getHref: (page: number) => string;
}

export function Pagination({ currentPage, pageCount, getHref }: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Blog pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {currentPage > 1 && (
        <Link
          href={getHref(currentPage - 1)}
          prefetch={false}
          className="inline-flex items-center rounded-full border border-secondary-200 px-4 py-2 text-sm font-medium text-secondary-600 transition-colors hover:border-primary-300 hover:text-primary-700"
        >
          Previous
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={getHref(page)}
          prefetch={false}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
            page === currentPage
              ? "bg-primary-600 text-white"
              : "border border-secondary-200 text-secondary-600 hover:border-primary-300 hover:text-primary-700"
          )}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page}
        </Link>
      ))}

      {currentPage < pageCount && (
        <Link
          href={getHref(currentPage + 1)}
          prefetch={false}
          className="inline-flex items-center rounded-full border border-secondary-200 px-4 py-2 text-sm font-medium text-secondary-600 transition-colors hover:border-primary-300 hover:text-primary-700"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
