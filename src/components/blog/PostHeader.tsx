import Image from "next/image";
import type { BlogPost } from "@/types/blog";
import { urlForImage } from "@/lib/sanity";
import PostMeta from "./PostMeta";

interface PostHeaderProps {
  post: BlogPost;
}

export default function PostHeader({ post }: PostHeaderProps) {
  const imageBuilder = urlForImage(post.coverImage ?? post.seo?.ogImage);
  const imageUrl = imageBuilder
    ?.width(1600)
    .height(900)
    .fit("crop")
    .auto("format")
    .url();

  return (
    <header className="space-y-8">
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center rounded-full bg-primary-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-600">
          Blog Insight
        </div>
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mx-auto max-w-3xl text-lg text-secondary-600">
            {post.excerpt}
          </p>
        ) : null}
      </div>

      <PostMeta post={post} showTags={false} />

      {imageUrl ? (
        <div className="overflow-hidden rounded-4xl border border-neutral-200">
          <Image
            src={imageUrl}
            alt={post.coverImage?.alt || post.seo?.ogImage?.alt || post.title}
            width={1600}
            height={900}
            className="h-auto w-full object-cover"
            priority
          />
          {post.coverImage?.caption && (
            <p className="px-6 py-3 text-xs text-secondary-500">
              {post.coverImage.caption}
            </p>
          )}
        </div>
      ) : null}
    </header>
  );
}
