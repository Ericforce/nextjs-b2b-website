import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";

import { PortableText } from "@/components/portable-text";
import {
  DEFAULT_SANITY_REVALIDATE,
  getAllBlogPosts,
  getBlogPostBySlug,
} from "@/lib/sanity";
import { AuthorCard, AuthorSummary } from "../_components/author";
import {
  absoluteUrl,
  buildArticleJsonLd,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";
import { formatDate } from "@/lib/utils/format";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = DEFAULT_SANITY_REVALIDATE;

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return generatePageMetadata({
    title: post.title,
    description: post.seo?.description ?? post.excerpt,
    seo: post.seo,
    canonicalPath: post.seo?.canonical ?? `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
    authors: post.author?.name ? [post.author.name] : undefined,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const { siteSettings } = await getMetadataDefaults();
  const canonicalUrl = absoluteUrl(
    post.seo?.canonical ?? `/blog/${post.slug}`,
    siteSettings.siteUrl
  );
  const jsonLd = buildArticleJsonLd(post, canonicalUrl, siteSettings);
  const readingTime =
    post.readingTime ??
    (post.readingTimeMinutes
      ? `${Math.max(1, Math.round(post.readingTimeMinutes))} min read`
      : undefined);

  return (
    <>
      <Script {...jsonLdScriptProps(`article-jsonld-${post.slug}`, jsonLd)} />
      <article className="container-custom mx-auto max-w-3xl py-16 lg:py-24">
        <header className="space-y-6">
          {post.categories.length > 0 ? (
            <div className="flex flex-wrap gap-2 text-sm font-medium text-primary-600">
              {post.categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  prefetch={false}
                  className="rounded-full bg-primary-50 px-3 py-1 text-primary-700 transition-colors hover:bg-primary-100"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          ) : null}

          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="text-lg text-secondary-600">{post.excerpt}</p>
          ) : null}

          <PostMeta
            publishedAt={post.publishedAt}
            updatedAt={post.updatedAt}
            readingTime={readingTime}
          />

          {post.author ? <AuthorSummary author={post.author} /> : null}
        </header>

        {post.featuredImage?.url ? (
          <figure className="mt-12 overflow-hidden rounded-3xl bg-secondary-100">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt ?? post.title}
              width={post.featuredImage.width ?? 1600}
              height={post.featuredImage.height ?? 900}
              className="h-auto w-full object-cover"
              sizes="100vw"
              placeholder={post.featuredImage.lqip ? "blur" : undefined}
              blurDataURL={post.featuredImage.lqip}
            />
            {post.featuredImage.alt ? (
              <figcaption className="px-4 py-3 text-sm text-secondary-500">
                {post.featuredImage.alt}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="mt-12">
          <PortableText value={post.body} />
        </div>

        <footer className="mt-12 space-y-8">
          {post.tags.length > 0 ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">
                Tags
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/blog/tag/${tag.slug}`}
                    prefetch={false}
                    className="rounded-full border border-secondary-200 px-3 py-1 text-sm text-secondary-600 transition-colors hover:border-primary-300 hover:text-primary-700"
                  >
                    #{tag.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {post.author ? <AuthorCard author={post.author} /> : null}
        </footer>
      </article>
    </>
  );
}

function PostMeta({
  publishedAt,
  updatedAt,
  readingTime,
}: {
  publishedAt: string;
  updatedAt?: string;
  readingTime?: string;
}) {
  const publishedDate = formatDate(publishedAt);
  const showUpdated = updatedAt && updatedAt !== publishedAt;
  const updatedDate = showUpdated ? formatDate(updatedAt) : undefined;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-secondary-500">
      <time dateTime={publishedAt}>{publishedDate}</time>
      {updatedDate ? (
        <>
          <span>•</span>
          <span>Updated {updatedDate}</span>
        </>
      ) : null}
      {readingTime ? (
        <>
          <span>•</span>
          <span>{readingTime}</span>
        </>
      ) : null}
    </div>
  );
}


