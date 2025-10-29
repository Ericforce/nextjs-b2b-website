import Image from "next/image";
import Link from "next/link";
import type { BlogPostSummary } from "@/types/blog";
import { formatDate } from "@/lib/utils";
import { urlForImage } from "@/lib/sanity";

interface PostMetaProps {
  post: BlogPostSummary;
  showCategories?: boolean;
  showTags?: boolean;
}

export default function PostMeta({
  post,
  showCategories = true,
  showTags = false,
}: PostMetaProps) {
  const avatarBuilder = urlForImage(post.author?.avatar);
  const avatarUrl = avatarBuilder
    ?.width(80)
    .height(80)
    .fit("crop")
    .auto("format")
    .url();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-secondary-600">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={post.author?.name || "Author avatar"}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
              {post.author?.name?.charAt(0)?.toUpperCase() ?? "B"}
            </div>
          )}
          <div className="space-y-1">
            {post.author?.name ? (
              <span className="block font-semibold text-secondary-900">
                {post.author.name}
              </span>
            ) : (
              <span className="block font-semibold text-secondary-900">
                Editorial Team
              </span>
            )}
            {post.author?.role && (
              <span className="block text-xs text-secondary-500">
                {post.author.role}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-wide text-secondary-500">
          {post.publishedAt && (
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="M7 3v2M17 3v2M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {formatDate(post.publishedAt)}
            </span>
          )}
          {post.estimatedReadingTime > 0 && (
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="M12 8v4l3 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              {post.estimatedReadingTime} min read
            </span>
          )}
        </div>
      </div>

      {showCategories && post.categories?.length ? (
        <div className="flex flex-wrap gap-2">
          {post.categories.map((category) => (
            <Link
              key={category.id}
              href={{ pathname: "/blog", query: { category: category.slug } }}
              className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100"
            >
              {category.title}
            </Link>
          ))}
        </div>
      ) : null}

      {showTags && post.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
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
    </div>
  );
}
