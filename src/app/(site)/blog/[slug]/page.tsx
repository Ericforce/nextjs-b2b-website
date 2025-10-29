import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import PostHeader from "@/components/blog/PostHeader";
import PortableTextRenderer from "@/components/blog/PortableTextRenderer";
import PostMeta from "@/components/blog/PostMeta";
import PostTableOfContents from "@/components/blog/PostTableOfContents";
import RelatedPosts from "@/components/blog/RelatedPosts";
import PostStructuredData from "@/components/blog/PostStructuredData";
import { env } from "@/lib/env";
import { fetchPostBySlug } from "@/lib/sanity";
import { urlForImage } from "@/lib/sanity";

export const revalidate = 60;

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await fetchPostBySlug({ slug: params.slug });

  if (!post) {
    return {
      title: "Post not found | Blog",
      description: "The requested blog post could not be found.",
    };
  }

  const canonicalUrl = new URL(`/blog/${post.slug}`, env.app.url).toString();
  const ogImageBuilder = urlForImage(post.seo?.ogImage ?? post.coverImage);
  const ogImageUrl = ogImageBuilder
    ?.width(1600)
    .height(900)
    .fit("crop")
    .auto("format")
    .url();

  const description = post.seo?.description ?? post.excerpt ?? undefined;
  const title = post.seo?.title ?? post.title;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalUrl,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1600,
              height: 900,
              alt: post.coverImage?.alt ?? post.title,
            },
          ]
        : undefined,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { isEnabled: preview } = draftMode();
  const post = await fetchPostBySlug({ slug: params.slug, preview });

  if (!post) {
    notFound();
  }

  const canonicalUrl = new URL(`/blog/${post.slug}`, env.app.url).toString();

  return (
    <article className="bg-white pb-24 pt-16">
      <div className="container-custom grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-12">
          {preview ? (
            <div className="rounded-2xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
              Preview mode active. Changes will not be publicly visible until
              published.
            </div>
          ) : null}

          <PostHeader post={post} />

          {post.body ? (
            <PortableTextRenderer value={post.body} />
          ) : (
            <p className="text-secondary-600">
              This post is currently missing its content.
            </p>
          )}

          <PostMeta post={post} showCategories={false} showTags />

          <RelatedPosts posts={post.relatedPosts} />
        </div>

        <aside className="space-y-6">
          <PostTableOfContents blocks={post.body} />
        </aside>
      </div>

      <PostStructuredData post={post} url={canonicalUrl} />
    </article>
  );
}
