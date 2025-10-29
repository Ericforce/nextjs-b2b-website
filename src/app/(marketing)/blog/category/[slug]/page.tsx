import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";

import { BLOG_PAGE_SIZE } from "@/lib/constants";
import {
  DEFAULT_SANITY_REVALIDATE,
  getBlogCategories,
  getBlogCategoryBySlug,
  getPaginatedBlogPosts,
} from "@/lib/sanity";
import { BlogCard, Pagination } from "../../_components/listing";
import {
  absoluteUrl,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    page?: string | string[];
  };
}

export const revalidate = DEFAULT_SANITY_REVALIDATE;

const FALLBACK_DESCRIPTION =
  "Browse the latest insights, updates, and best practices curated by our team.";

export async function generateStaticParams() {
  const categories = await getBlogCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getBlogCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  return generatePageMetadata({
    title: `${category.title} Articles`,
    description: category.description ?? FALLBACK_DESCRIPTION,
    seo: category.seo,
    canonicalPath: buildCategoryPath(category.slug),
  });
}

export default async function CategoryArchivePage({
  params,
  searchParams = {},
}: CategoryPageProps) {
  const pageParam = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const category = await getBlogCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const paginated = await getPaginatedBlogPosts({
    page,
    pageSize: BLOG_PAGE_SIZE,
    categorySlug: category.slug,
  });

  if (page > paginated.pageCount && paginated.pageCount > 0) {
    notFound();
  }

  const { siteSettings } = await getMetadataDefaults();
  const canonicalPath = buildCategoryPath(category.slug, page);
  const canonicalUrl = absoluteUrl(canonicalPath, siteSettings.siteUrl);
  const description = category.description ?? FALLBACK_DESCRIPTION;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.title} — ${siteSettings.siteName} Blog`,
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
        {...jsonLdScriptProps(
          `blog-category-jsonld-${category.slug}-${page}`,
          jsonLd
        )}
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
            Category
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            {category.title}
          </h1>
          <p className="mt-4 text-lg text-secondary-600">{description}</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {paginated.posts.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-secondary-200 bg-secondary-50 p-12 text-center">
              <h2 className="text-xl font-semibold text-secondary-900">
                No posts published yet
              </h2>
              <p className="mt-2 text-secondary-600">
                We're working on new stories for {category.title}. Check back soon.
              </p>
            </div>
          ) : (
            paginated.posts.map((post) => <BlogCard key={post.slug} post={post} />)
          )}
        </div>

        <Pagination
          currentPage={paginated.page}
          pageCount={paginated.pageCount}
          getHref={(pageNumber) => buildCategoryPath(category.slug, pageNumber)}
        />
      </section>
    </>
  );
}

function buildCategoryPath(slug: string, page?: number) {
  if (page && page > 1) {
    return `/blog/category/${slug}?page=${page}`;
  }

  return `/blog/category/${slug}`;
}
