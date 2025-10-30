import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";

import { AuthorBadge, Pagination, PostList } from "@/components/blog";
import {
  DEFAULT_BLOG_PAGE_SIZE,
  DEFAULT_SANITY_REVALIDATE,
  getAllBlogAuthors,
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

interface AuthorArchivePageProps {
  params: {
    slug: string;
  };
  searchParams?: BlogSearchParams;
}

export async function generateStaticParams() {
  const authors = await getAllBlogAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
  searchParams = {},
}: AuthorArchivePageProps): Promise<Metadata> {
  const author = await getBlogAuthorBySlug(params.slug);

  if (!author) {
    notFound();
  }

  const categorySlug = getParamValue(searchParams.category);
  const tagSlug = getParamValue(searchParams.tag);
  const pageParam = getParamValue(searchParams.page);
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const category = categorySlug ? await getBlogCategoryBySlug(categorySlug) : null;
  const tag = tagSlug ? await getBlogTagBySlug(tagSlug) : null;

  const titleParts = [author.name];
  if (category) {
    titleParts.push(category.title);
  }
  if (tag) {
    titleParts.push(`#${tag.title}`);
  }
  if (page > 1) {
    titleParts.push(`Page ${page}`);
  }

  const title = `${titleParts.join(" · ")} | Author Spotlight`;

  const description = author.bio
    ? author.bio
    : `Articles written by ${author.name} for the Next.js B2B blog.`;

  const canonicalPath = buildBlogUrl(`/blog/author/${author.slug}`, {}, {
    category: categorySlug || undefined,
    tag: tagSlug || undefined,
    page: page > 1 ? String(page) : undefined,
  });

  return generatePageMetadata({
    title,
    description,
    canonicalPath,
  });
}

export default async function AuthorArchivePage({
  params,
  searchParams = {},
}: AuthorArchivePageProps) {
  const author = await getBlogAuthorBySlug(params.slug);

  if (!author) {
    notFound();
  }

  const categorySlug = getParamValue(searchParams.category);
  const tagSlug = getParamValue(searchParams.tag);
  const pageParam = getParamValue(searchParams.page);
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [category, tag, listResult, metadataDefaults] = await Promise.all([
    categorySlug ? getBlogCategoryBySlug(categorySlug) : Promise.resolve(null),
    tagSlug ? getBlogTagBySlug(tagSlug) : Promise.resolve(null),
    getPaginatedBlogPosts({
      page,
      pageSize: DEFAULT_BLOG_PAGE_SIZE,
      author: author.slug,
      category: categorySlug ?? undefined,
      tag: tagSlug ?? undefined,
    }),
    getMetadataDefaults(),
  ]);

  const { siteSettings } = metadataDefaults;
  const basePath = `/blog/author/${author.slug}`;
  const canonicalPath = buildBlogUrl(basePath, {}, {
    category: categorySlug || undefined,
    tag: tagSlug || undefined,
    page: listResult.page > 1 ? String(listResult.page) : undefined,
  });
  const canonicalUrl = absoluteUrl(canonicalPath, siteSettings.siteUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Articles by ${author.name}`,
    url: canonicalUrl,
    description:
      author.bio ?? `A collection of writing from ${author.name}.`,
    mainEntity: listResult.items.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`, siteSettings.siteUrl),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
    })),
  };

  const hasResults = listResult.items.length > 0;
  const hasAdditionalFilters = Boolean(category || tag);
  const normalizedSearchParams: BlogSearchParams = {
    category: categorySlug ?? undefined,
    tag: tagSlug ?? undefined,
    page: listResult.page > 1 ? String(listResult.page) : undefined,
  };

  return (
    <>
      <Script {...jsonLdScriptProps(`author-jsonld-${author.slug}`, jsonLd)} />

      <section className="container-custom mx-auto max-w-4xl space-y-12 py-16 lg:py-24">
        <header className="space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            Author
          </p>
          <AuthorBadge author={author} showLinks className="mx-auto justify-center" />
          {author.bio ? (
            <p className="mx-auto max-w-2xl text-secondary-600">{author.bio}</p>
          ) : null}
          {hasAdditionalFilters ? (
            <div className="flex flex-wrap justify-center gap-3 text-sm text-secondary-500">
              {category ? <span>Category: {category.title}</span> : null}
              {tag ? <span>Tag: #{tag.title}</span> : null}
            </div>
          ) : null}
          <div className="flex justify-center gap-6 text-sm text-primary-600">
            <Link href="/blog" className="font-medium hover:text-primary-700">
              All posts
            </Link>
            {hasAdditionalFilters ? (
              <a
                href={buildBlogUrl(basePath, normalizedSearchParams, {
                  category: undefined,
                  tag: undefined,
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
              No posts from this author yet
            </h2>
            <p className="mt-2 text-secondary-600">
              Check back soon or explore stories from the rest of the team.
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
