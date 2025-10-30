import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";

import { AuthorBadge } from "@/components/blog";
import { PortableText } from "@/components/portable-text";
import {
  DEFAULT_SANITY_REVALIDATE,
  getAllBlogPostSlugs,
  getBlogPostBySlug,
} from "@/lib/sanity";
import {
  absoluteUrl,
  buildArticleJsonLd,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";
import { formatDate } from "@/lib/utils/format";

export const revalidate = DEFAULT_SANITY_REVALIDATE;

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
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
    authors: post.author ? [post.author.name] : undefined,
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

  const publishedDate = post.publishedAt ? formatDate(post.publishedAt) : null;
  const updatedDate =
    post.updatedAt && post.updatedAt !== post.publishedAt
      ? formatDate(post.updatedAt)
      : null;

  return (
    <>
      <Script
        {...jsonLdScriptProps(`article-jsonld-${post.slug}`, jsonLd)}
      />

      <article className="container-custom mx-auto max-w-3xl space-y-12 py-16 lg:py-24">
        <header className="space-y-6 text-center">
          {post.categories.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2">
              {post.categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/blog/category/${category.slug}`}
                  className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 transition-colors hover:border-primary-400 hover:text-primary-800"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="text-lg text-secondary-600">{post.excerpt}</p>
            ) : null}
          </div>

          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <AuthorBadge author={post.author} showLinks />
            <div className="flex flex-col items-center gap-2 text-sm text-secondary-500 sm:items-start">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                {publishedDate ? <span>Published {publishedDate}</span> : null}
                {publishedDate && post.readingTime ? (
                  <span aria-hidden="true">•</span>
                ) : null}
                {post.readingTime ? <span>{post.readingTime}</span> : null}
              </div>
              {updatedDate ? <span>Updated {updatedDate}</span> : null}
            </div>
          </div>
        </header>

        {post.featuredImage?.url ? (
          <figure className="overflow-hidden rounded-3xl border border-secondary-200">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt ?? post.title}
              width={post.featuredImage.width ?? 1200}
              height={post.featuredImage.height ?? 630}
              className="h-auto w-full object-cover"
              priority={false}
            />
            {post.featuredImage.alt ? (
              <figcaption className="px-4 py-3 text-sm text-secondary-500">
                {post.featuredImage.alt}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        <div className="prose prose-lg mx-auto max-w-none text-secondary-700">
          <PortableText value={post.body} />
        </div>

        <footer className="space-y-6 border-t border-secondary-200 pt-8">
          {post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag._id}
                  href={`/blog/tag/${tag.slug}`}
                  className="inline-flex items-center rounded-full border border-secondary-200 bg-secondary-50 px-3 py-1 text-xs font-medium text-secondary-600 transition-colors hover:border-primary-200 hover:text-primary-700"
                >
                  #{tag.title}
                </Link>
              ))}
            </div>
          ) : null}

          {post.categories.length > 0 ? (
            <div className="text-sm text-secondary-500">
              Posted in {" "}
              {post.categories.map((category, index) => (
                <span key={category._id}>
                  <Link
                    href={`/blog/category/${category.slug}`}
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    {category.title}
                  </Link>
                  {index < post.categories.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          ) : null}
        </footer>
      </article>
    </>
  );
}
