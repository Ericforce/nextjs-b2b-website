import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";

import { Pagination, PostList } from "@/components/blog";
import {
  DEFAULT_BLOG_PAGE_SIZE,
  DEFAULT_SANITY_REVALIDATE,
  getAllBlogCategories,
  getBlogAuthorBySlug,
  getBlogCategoryBySlug,
  getBlogTagBySlug,
  getPaginatedBlogPosts,
} from "@/lib/sanity";
import {
  absoluteUrl,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";
import {
  buildBlogUrl,
  getParamValue,
  type BlogSearchParams,
} from "@/components/blog/utils";

export const revalidate = DEFAULT_SANITY_REVALIDATE;

interface CategoryArchivePageProps {
  params: {
    slug: string;
  };
  searchParams?: BlogSearchParams;
}

export async function generateStaticParams() {
  const categories = await getAllBlogCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
  searchParams = {},
}: CategoryArchivePageProps): Promise<Metadata> {
  const category = await getBlogCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const tagSlug = getParamValue(searchParams.tag);
  const authorSlug = getParamValue(searchParams.author);
  const pageParam = getParamValue(searchParams.page);
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const tag = tagSlug ? await getBlogTagBySlug(tagSlug) : null;
  const author = authorSlug ? await getBlogAuthorBySlug(authorSlug) : null;

  const titleParts = [category.title];
  if (tag) {
    titleParts.push(`#${tag.title}`);
  }
  if (author) {
    titleParts.push(author.name);
  }
  if (page > 1) {
    titleParts.push(`Page ${page}`);
  }

  const title = `${titleParts.join(" · ")} | Category Insights`;

  const description = category.description
    ? `${category.description}${tag ? ` Tagged with ${tag.title}.` : ""}`
    : `Explore the latest ${category.title} articles from the Next.js B2B team.`;

  const canonicalPath = buildBlogUrl(`/blog/category/${category.slug}`, {}, {
    tag: tagSlug || undefined,
    author: authorSlug || undefined,
    page: page > 1 ? String(page) : undefined,
  });

  return generatePageMetadata({
    title,
    description,
    canonicalPath,
  });
}

export default async function CategoryArchivePage({
  params,
  searchParams = {},
}: CategoryArchivePageProps) {
  const category = await getBlogCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const tagSlug = getParamValue(searchParams.tag);
  const authorSlug = getParamValue(searchParams.author);
  const pageParam = getParamValue(searchParams.page);
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [tag, author, listResult, metadataDefaults] = await Promise.all([
    tagSlug ? getBlogTagBySlug(tagSlug) : Promise.resolve(null),
    authorSlug ? getBlogAuthorBySlug(authorSlug) : Promise.resolve(null),
    getPaginatedBlogPosts({
      page,
      pageSize: DEFAULT_BLOG_PAGE_SIZE,
      category: category.slug,
      tag: tagSlug ?? undefined,
      author: authorSlug ?? undefined,
    }),
    getMetadataDefaults(),
  ]);

  const { siteSettings } = metadataDefaults;
  const basePath = `/blog/category/${category.slug}`;
  const canonicalPath = buildBlogUrl(basePath, {}, {
    tag: tagSlug || undefined,
    author: authorSlug || undefined,
    page: listResult.page > 1 ? String(listResult.page) : undefined,
  });
  const canonicalUrl = absoluteUrl(canonicalPath, siteSettings.siteUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.title} Articles`,
    url: canonicalUrl,
    description:
      category.description ?? `Insights and updates about ${category.title}.`,
    mainEntity: listResult.items.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`, siteSettings.siteUrl),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
    })),
  };

  const hasResults = listResult.items.length > 0;
  const hasAdditionalFilters = Boolean(tag || author);
  const normalizedSearchParams: BlogSearchParams = {
    tag: tagSlug ?? undefined,
    author: authorSlug ?? undefined,
    page: listResult.page > 1 ? String(listResult.page) : undefined,
  };

  return (
    <>
      <Script {...jsonLdScriptProps(`category-jsonld-${category.slug}`, jsonLd)} />

      <section className="container-custom mx-auto max-w-5xl space-y-12 py-16 lg:py-24">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            Category
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            {category.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600">
            {category.description ?? `Explore the latest ${category.title} insights.`}
          </p>
          {hasAdditionalFilters ? (
            <div className="flex flex-wrap justify-center gap-3 text-sm text-secondary-500">
              {tag ? <span>Tag: #{tag.title}</span> : null}
              {author ? <span>Author: {author.name}</span> : null}
            </div>
          ) : null}
          <div className="flex justify-center gap-6 text-sm text-primary-600">
            <Link
              href="/blog"
              className="font-medium hover:text-primary-700"
            >
              All posts
            </Link>
            {hasAdditionalFilters ? (
              <a
                href={buildBlogUrl(basePath, normalizedSearchParams, {
                  tag: undefined,
                  author: undefined,
                  page: undefined,
                })}
                className="font-medium hover:text-primary-700"
              >
                Clear filters
              </a>
            ) : null}
          </div>
        </header>

        {hasResults ? (
          <div className="space-y-12">
            <PostList posts={listResult.items} />
            <Pagination
              basePath={basePath}
              page={listResult.page}
              pageCount={listResult.pageCount}
              hasNextPage={listResult.hasNextPage}
              hasPreviousPage={listResult.hasPreviousPage}
              searchParams={normalizedSearchParams}
            />
          </div>
        ) : (
          <div className="rounded-3xl border border-secondary-200 bg-secondary-50 p-12 text-center">
            <h2 className="text-2xl font-semibold text-secondary-900">
              No posts found in this category
            </h2>
            <p className="mt-2 text-secondary-600">
              Try adjusting your filters or return to the full blog archive for more stories.
            </p>
            <Link
              href="/blog"
              className="mt-4 inline-flex items-center rounded-full border border-primary-200 px-4 py-2 text-sm font-medium text-primary-600 transition-colors hover:border-primary-400 hover:text-primary-700"
            >
              Browse all posts
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
