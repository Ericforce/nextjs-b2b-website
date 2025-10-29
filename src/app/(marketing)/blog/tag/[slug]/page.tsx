import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";

import { BLOG_PAGE_SIZE } from "@/lib/constants";
import {
  DEFAULT_SANITY_REVALIDATE,
  getBlogTagBySlug,
  getBlogTags,
  getPaginatedBlogPosts,
} from "@/lib/sanity";
import { BlogCard, Pagination } from "../../_components/listing";
import {
  absoluteUrl,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";

interface TagPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    page?: string | string[];
  };
}

export const revalidate = DEFAULT_SANITY_REVALIDATE;

const TAG_FALLBACK_DESCRIPTION =
  "Discover articles, updates, and resources curated by topic.";

export async function generateStaticParams() {
  const tags = await getBlogTags();
  return tags.map((tag) => ({ slug: tag.slug }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const tag = await getBlogTagBySlug(params.slug);

  if (!tag) {
    notFound();
  }

  return generatePageMetadata({
    title: `Posts tagged ${tag.title}`,
    description: tag.description ?? TAG_FALLBACK_DESCRIPTION,
    seo: tag.seo,
    canonicalPath: buildTagPath(tag.slug),
  });
}

export default async function TagArchivePage({
  params,
  searchParams = {},
}: TagPageProps) {
  const pageParam = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const tag = await getBlogTagBySlug(params.slug);

  if (!tag) {
    notFound();
  }

  const paginated = await getPaginatedBlogPosts({
    page,
    pageSize: BLOG_PAGE_SIZE,
    tagSlug: tag.slug,
  });

  if (page > paginated.pageCount && paginated.pageCount > 0) {
    notFound();
  }

  const { siteSettings } = await getMetadataDefaults();
  const canonicalPath = buildTagPath(tag.slug, page);
  const canonicalUrl = absoluteUrl(canonicalPath, siteSettings.siteUrl);
  const description = tag.description ?? TAG_FALLBACK_DESCRIPTION;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `#${tag.title} — ${siteSettings.siteName} Blog`,
    url: canonicalUrl,
    description,
    mainEntity: paginated.posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`, siteSettings.siteUrl),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
    })),
  };

  return (
    <>
      <Script
        {...jsonLdScriptProps(`blog-tag-jsonld-${tag.slug}-${page}`, jsonLd)}
      />
      <section className="container-custom mx-auto max-w-6xl py-16 lg:py-24">
        <Link
          href="/blog"
          prefetch={false}
          className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
        >
          ← Back to all posts
        </Link>

        <div className="mt-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            Tag
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            #{tag.title}
          </h1>
          <p className="mt-4 text-lg text-secondary-600">{description}</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {paginated.posts.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-secondary-200 bg-secondary-50 p-12 text-center">
              <h2 className="text-xl font-semibold text-secondary-900">
                No tagged posts yet
              </h2>
              <p className="mt-2 text-secondary-600">
                We haven't published articles tagged with {tag.title} just yet.
              </p>
            </div>
          ) : (
            paginated.posts.map((post) => <BlogCard key={post.slug} post={post} />)
          )}
        </div>

        <Pagination
          currentPage={paginated.page}
          pageCount={paginated.pageCount}
          getHref={(pageNumber) => buildTagPath(tag.slug, pageNumber)}
        />
      </section>
    </>
  );
}

function buildTagPath(slug: string, page?: number) {
  if (page && page > 1) {
    return `/blog/tag/${slug}?page=${page}`;
  }

  return `/blog/tag/${slug}`;
}
