import Image from "next/image";
import Link from "next/link";

import { AuthorBadge } from "@/components/blog/AuthorBadge";
import Card from "@/components/ui/Card";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { BlogPostDocument } from "@/types";

const BADGE_BASE_CLASSES =
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors";

export interface PostCardProps {
  post: BlogPostDocument;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const publishedDate = post.publishedAt ?? post.createdAt;
  const formattedDate = publishedDate ? formatDate(publishedDate) : undefined;
  const hasReadingTime = Boolean(post.readingTime);

  return (
    <Card
      variant="outlined"
      className={cn(
        "flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-lg",
        className
      )}
    >
      {post.featuredImage?.url ? (
        <Link
          href={`/blog/${post.slug}`}
          className="relative block aspect-[16/9] overflow-hidden"
        >
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt ?? post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority={false}
          />
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col gap-6 p-6">
        {post.categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Link
                key={category._id}
                href={`/blog/category/${category.slug}`}
                className={cn(
                  BADGE_BASE_CLASSES,
                  "border-primary-200 bg-primary-50 text-primary-700"
                )}
              >
                {category.title}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="space-y-3">
          <h3 className="text-2xl font-semibold leading-snug text-secondary-900">
            <Link
              href={`/blog/${post.slug}`}
              className="transition-colors hover:text-primary-600"
            >
              {post.title}
            </Link>
          </h3>
          {post.excerpt ? (
            <p className="text-secondary-600">{post.excerpt}</p>
          ) : null}
        </div>

        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 text-xs text-secondary-500">
            {post.tags.map((tag) => (
              <Link
                key={tag._id}
                href={`/blog/tag/${tag.slug}`}
                className={cn(
                  BADGE_BASE_CLASSES,
                  "border-secondary-200 bg-secondary-50 text-secondary-600"
                )}
              >
                #{tag.title}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-4">
          <AuthorBadge author={post.author} compact showRole={false} />
          <div className="text-right text-sm text-secondary-500">
            {formattedDate ? <span>{formattedDate}</span> : null}
            {formattedDate && hasReadingTime ? (
              <span className="mx-2" aria-hidden="true">
                •
              </span>
            ) : null}
            {hasReadingTime ? <span>{post.readingTime}</span> : null}
          </div>
        </div>
      </div>
    </Card>
  );
}
