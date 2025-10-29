import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";

import { BLOG_PAGE_SIZE } from "@/lib/constants";
import {
  DEFAULT_SANITY_REVALIDATE,
  getBlogCategories,
  getBlogCategoryBySlug,
  getBlogTags,
  getBlogTagBySlug,
  getPaginatedBlogPosts,
} from "@/lib/sanity";
import { BlogCard, Pagination } from "./_components/listing";
import {
  absoluteUrl,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";
import { cn } from "@/lib/utils";

interface BlogIndexPageProps {
  searchParams?: {
    page?: string | string[];
    category?: string | string[];
    tag?: string | string[];
  };
}

export const revalidate = DEFAULT_SANITY_REVALIDATE;

const DEFAULT_BLOG_DESCRIPTION =
  "Field notes, product announcements, and best practices for modern B2B teams.";

function coerceParam(value?: string | string[]): string | undefined {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value[0] : value;
}

function buildBlogPath({
  category,
  tag,
  page,
}: {
  category?: string;
  tag?: string;
  page?: number;
}) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (tag) {
    params.set("tag", tag);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export async function generateMetadata({
  searchParams,
}: BlogIndexPageProps): Promise<Metadata> {
  const categorySlug = coerceParam(searchParams?.category);
  const tagSlug = coerceParam(searchParams?.tag);
  const pageParam = coerceParam(searchParams?.page);
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [category, tag] = await Promise.all([
    categorySlug ? getBlogCategoryBySlug(categorySlug) : Promise.resolve(null),
    tagSlug ? getBlogTagBySlug(tagSlug) : Promise.resolve(null),
  ]);

  if (categorySlug && !category) {
    notFound();
  }

  if (tagSlug && !tag) {
    notFound();
  }

  const segments: string[] = [];

  if (category) {
    segments.push(`Category: ${category.title}`);
  }

  if (tag) {
    segments.push(`Tag: ${tag.title}`);
  }

  if (page > 1) {
    segments.push(`Page ${page}`);
  }

  const baseTitle = "Insights from the Next.js B2B Team";
  const title = segments.length > 0 ? `${segments.join(" · ")} | ${baseTitle}` : baseTitle;
  const description =
    category?.description ?? tag?.description ?? DEFAULT_BLOG_DESCRIPTION;

  return generatePageMetadata({
    title,
    description,
    canonicalPath: buildBlogPath({
      category: categorySlug,
      tag: tagSlug,
      page,
    }),
  });
}

export default async function BlogIndexPage({
  searchParams = {},
}: BlogIndexPageProps) {
  const categorySlug = coerceParam(searchParams.category);
  const tagSlug = coerceParam(searchParams.tag);
  const pageParam = coerceParam(searchParams.page);
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [categories, tags, paginated, metadataDefaults] = await Promise.all([
    getBlogCategories(),
    getBlogTags(),
    getPaginatedBlogPosts({
      page,
      pageSize: BLOG_PAGE_SIZE,
      categorySlug,
      tagSlug,
    }),
    getMetadataDefaults(),
  ]);

  const selectedCategory = categorySlug
    ? categories.find((category) => category.slug === categorySlug)
    : undefined;

  if (categorySlug && !selectedCategory) {
    notFound();
  }

  const selectedTag = tagSlug
    ? tags.find((tag) => tag.slug === tagSlug)
    : undefined;

  if (tagSlug && !selectedTag) {
    notFound();
  }

  if (page > paginated.pageCount && paginated.pageCount > 0) {
    notFound();
  }

  const { siteSettings } = metadataDefaults;
  const canonicalPath = buildBlogPath({ category: categorySlug, tag: tagSlug, page });
  const canonicalUrl = absoluteUrl(canonicalPath, siteSettings.siteUrl);
  const description =
    selectedCategory?.description ??
    selectedTag?.description ??
    DEFAULT_BLOG_DESCRIPTION;

  const heading = selectedCategory
    ? `Latest in ${selectedCategory.title}`
    : selectedTag
    ? `Posts tagged ${selectedTag.title}`
    : "Latest from the team";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteSettings.siteName} Blog`,
    url: canonicalUrl,
    description,
    blogPost: paginated.posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`, siteSettings.siteUrl),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      author: post.author?.name,
    })),
  };

  const jsonLdId = [
    "blog-index-jsonld",
    categorySlug ?? "all",
    tagSlug ?? "all",
    String(paginated.page),
  ].join("-");

  const categoryFilters: FilterOption[] = [
    { label: "All categories" },
    ...categories.map((category) => ({
      label: category.title,
      slug: category.slug,
      count: category.postCount,
    })),
  ];

  const tagFilters: FilterOption[] = [
    { label: "All tags" },
    ...tags.map((tag) => ({
      label: tag.title,
      slug: tag.slug,
      count: tag.postCount,
    })),
  ];

  return (
    <>
      <Script {...jsonLdScriptProps(jsonLdId, jsonLd)} />
      <section className="container-custom mx-auto max-w-6xl py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-wide text-primary-600">
            Insights
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            {heading}
          </h1>
          <p className="mt-4 text-lg text-secondary-600">{description}</p>
        </div>

        <div className="mt-12 space-y-8">
          <FilterGroup
            label="Categories"
            items={categoryFilters}
            activeSlug={categorySlug}
            buildHref={(slug) =>
              buildBlogPath({ category: slug, tag: tagSlug })
            }
          />
          <FilterGroup
            label="Tags"
            items={tagFilters}
            activeSlug={tagSlug}
            buildHref={(slug) =>
              buildBlogPath({ category: categorySlug, tag: slug })
            }
          />
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {paginated.posts.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-secondary-200 bg-secondary-50 p-12 text-center">
              <h2 className="text-xl font-semibold text-secondary-900">
                No posts yet
              </h2>
              <p className="mt-2 text-secondary-600">
                {selectedCategory
                  ? `We haven't published anything in ${selectedCategory.title} yet.`
                  : selectedTag
                  ? `No posts have been tagged with ${selectedTag.title} yet.`
                  : "Check back soon for new articles from the team."}
              </p>
            </div>
          ) : (
            paginated.posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))
          )}
        </div>

        <Pagination
          currentPage={paginated.page}
          pageCount={paginated.pageCount}
          getHref={(pageNumber) =>
            buildBlogPath({
              category: categorySlug,
              tag: tagSlug,
              page: pageNumber,
            })
          }
        />
      </section>
    </>
  );
}

interface FilterOption {
  label: string;
  slug?: string;
  count?: number;
}

interface FilterGroupProps {
  label: string;
  items: FilterOption[];
  activeSlug?: string;
  buildHref: (slug?: string) => string;
}

function FilterGroup({ label, items, activeSlug, buildHref }: FilterGroupProps) {
  if (!items || items.length <= 1) {
    return null;
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {items.map((item) => {
          const isActive =
            (!item.slug && !activeSlug) ||
            (item.slug && item.slug === activeSlug);
          const displayLabel =
            item.count !== undefined && item.slug
              ? `${item.label} (${item.count ?? 0})`
              : item.label;

          return (
            <FilterPill
              key={item.slug ?? "all"}
              label={displayLabel}
              href={buildHref(item.slug)}
              isActive={isActive}
            />
          );
        })}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  href,
  isActive,
}: {
  label: string;
  href: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(
        "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "border-primary-500 bg-primary-50 text-primary-700"
          : "border-secondary-200 text-secondary-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
      )}
    >
      {label}
    </Link>
  );
}
