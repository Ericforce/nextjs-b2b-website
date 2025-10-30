import type { Metadata } from "next";
import Script from "next/script";

import { BlogFilters, Pagination, PostList } from "@/components/blog";
import {
  DEFAULT_BLOG_PAGE_SIZE,
  DEFAULT_SANITY_REVALIDATE,
  getBlogFilters,
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

interface BlogIndexPageProps {
  searchParams?: BlogSearchParams;
}

function resolveFilterSummary(options: {
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  filters: Awaited<ReturnType<typeof getBlogFilters>>;
}) {
  const { categorySlug, tagSlug, authorSlug, filters } = options;
  const category = categorySlug
    ? filters.categories.find((item) => item.slug === categorySlug)
    : undefined;
  const tag = tagSlug
    ? filters.tags.find((item) => item.slug === tagSlug)
    : undefined;
  const author = authorSlug
    ? filters.authors.find((item) => item.slug === authorSlug)
    : undefined;

  const parts = [
    category ? `${category.title}` : null,
    tag ? `#${tag.title}` : null,
    author ? author.name : null,
  ].filter((value): value is string => Boolean(value));

  return {
    parts,
    category,
    tag,
    author,
  };
}

export async function generateMetadata({
  searchParams = {},
}: BlogIndexPageProps): Promise<Metadata> {
  const categorySlug = getParamValue(searchParams.category);
  const tagSlug = getParamValue(searchParams.tag);
  const authorSlug = getParamValue(searchParams.author);
  const pageParam = getParamValue(searchParams.page);
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const filters = await getBlogFilters();
  const { parts } = resolveFilterSummary({
    categorySlug,
    tagSlug,
    authorSlug,
    filters,
  });

  const baseTitle = "Insights from the Next.js B2B Team";
  const filterTitle = parts.join(" · ");
  const title = [
    filterTitle || null,
    page > 1 ? `Page ${page}` : null,
    baseTitle,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" | ") || baseTitle;

  const description = parts.length
    ? `Browse ${parts.join(", ")} articles from the Next.js B2B team.`
    : "The latest stories, product updates, and best practices from the Next.js B2B Application team.";

  const canonicalPath = buildBlogUrl("/blog", {}, {
    category: categorySlug || undefined,
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

export default async function BlogIndexPage({
  searchParams = {},
}: BlogIndexPageProps) {
  const categorySlug = getParamValue(searchParams.category);
  const tagSlug = getParamValue(searchParams.tag);
  const authorSlug = getParamValue(searchParams.author);
  const pageParam = getParamValue(searchParams.page);
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [filters, listResult, metadataDefaults] = await Promise.all([
    getBlogFilters(),
    getPaginatedBlogPosts({
      page,
      pageSize: DEFAULT_BLOG_PAGE_SIZE,
      category: categorySlug ?? undefined,
      tag: tagSlug ?? undefined,
      author: authorSlug ?? undefined,
    }),
    getMetadataDefaults(),
  ]);

  const { parts, category, tag, author } = resolveFilterSummary({
    categorySlug,
    tagSlug,
    authorSlug,
    filters,
  });

  const filterHeadline = parts.length > 0 ? parts.join(" · ") : "Latest from the team";
  const { siteSettings } = metadataDefaults;

  const canonicalPath = buildBlogUrl("/blog", {}, {
    category: categorySlug || undefined,
    tag: tagSlug || undefined,
    author: authorSlug || undefined,
    page: listResult.page > 1 ? String(listResult.page) : undefined,
  });
  const canonicalUrl = absoluteUrl(canonicalPath, siteSettings.siteUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: parts.length
      ? `${parts.join(" · ")} | ${siteSettings.siteName} Blog`
      : `${siteSettings.siteName} Blog`,
    url: canonicalUrl,
    description:
      "The latest stories, product updates, and best practices from the Next.js B2B Application team.",
    blogPost: listResult.items.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`, siteSettings.siteUrl),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: post.author
        ? {
            "@type": "Person",
            name: post.author.name,
          }
        : undefined,
    })),
  };

  const hasResults = listResult.items.length > 0;
  const hasActiveFilters = Boolean(category || tag || author);
  const normalizedSearchParams: BlogSearchParams = {
    ...searchParams,
    category: categorySlug ?? undefined,
    tag: tagSlug ?? undefined,
    author: authorSlug ?? undefined,
    page: listResult.page > 1 ? String(listResult.page) : undefined,
  };

  return (
    <>
      <Script {...jsonLdScriptProps("blog-index-jsonld", jsonLd)} />

      <section className="container-custom mx-auto flex max-w-6xl flex-col gap-12 py-16 lg:py-24">
        <header className="space-y-5 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            Insights
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            {filterHeadline}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-secondary-600">
            {category?.description ?? tag?.description ??
              "Field notes, product announcements, and best practices for modern B2B teams."}
          </p>
        </header>

        <BlogFilters
          basePath="/blog"
          categories={filters.categories}
          tags={filters.tags}
          authors={filters.authors}
          activeCategory={categorySlug}
          activeTag={tagSlug}
          activeAuthor={authorSlug}
          searchParams={normalizedSearchParams}
        />

        {hasResults ? (
          <div className="space-y-12">
            <PostList posts={listResult.items} />
            <Pagination
              basePath="/blog"
              page={listResult.page}
              pageCount={listResult.pageCount}
              hasNextPage={listResult.hasNextPage}
              hasPreviousPage={listResult.hasPreviousPage}
              searchParams={normalizedSearchParams}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-secondary-200 bg-secondary-50 p-12 text-center">
            <h2 className="text-2xl font-semibold text-secondary-900">
              No posts match your filters yet
            </h2>
            <p className="max-w-xl text-secondary-600">
              Try adjusting or clearing your filters to discover more insights from the team.
            </p>
            {hasActiveFilters ? (
              <a
                href={buildBlogUrl("/blog", normalizedSearchParams, {
                  category: undefined,
                  tag: undefined,
                  author: undefined,
                  page: undefined,
                })}
                className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
              >
                Clear filters
              </a>
            ) : null}
          </div>
        )}
      </section>
    </>
  );
}
