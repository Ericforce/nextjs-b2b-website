import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";

import { BLOG_PAGE_SIZE } from "@/lib/constants";
import {
  DEFAULT_SANITY_REVALIDATE,
  getBlogAuthorBySlug,
  getBlogAuthors,
  getPaginatedBlogPosts,
} from "@/lib/sanity";
import { AuthorCard, AuthorSummary, type Author } from "../../_components/author";
import { BlogCard, Pagination } from "../../_components/listing";
import {
  absoluteUrl,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";

interface AuthorPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    page?: string | string[];
  };
}

export const revalidate = DEFAULT_SANITY_REVALIDATE;

const AUTHOR_FALLBACK_DESCRIPTION =
  "Insights and articles written by our team members.";

export async function generateStaticParams() {
  const authors = await getBlogAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const author = await getBlogAuthorBySlug(params.slug);

  if (!author) {
    notFound();
  }

  return generatePageMetadata({
    title: `${author.name} — Author Profile`,
    description:
      author.shortBio ?? AUTHOR_FALLBACK_DESCRIPTION,
    canonicalPath: buildAuthorPath(author.slug),
    seo: author.seo,
  });
}

export default async function AuthorArchivePage({
  params,
  searchParams = {},
}: AuthorPageProps) {
  const pageParam = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page;
  const parsedPage = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const author = await getBlogAuthorBySlug(params.slug);

  if (!author) {
    notFound();
  }

  const paginated = await getPaginatedBlogPosts({
    page,
    pageSize: BLOG_PAGE_SIZE,
    authorSlug: author.slug,
  });

  if (page > paginated.pageCount && paginated.pageCount > 0) {
    notFound();
  }

  const { siteSettings } = await getMetadataDefaults();
  const canonicalPath = buildAuthorPath(author.slug, page);
  const canonicalUrl = absoluteUrl(canonicalPath, siteSettings.siteUrl);
  const description =
    author.shortBio ?? AUTHOR_FALLBACK_DESCRIPTION;

  const jsonLd = buildAuthorJsonLd(author, canonicalUrl, siteSettings.siteName);

  return (
    <>
      <Script
        {...jsonLdScriptProps(`blog-author-jsonld-${author.slug}-${page}`, jsonLd)}
      />
      <section className="container-custom mx-auto max-w-6xl py-16 lg:py-24">
        <Link
          href="/blog"
          prefetch={false}
          className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
        >
          ← Back to all posts
        </Link>

        <div className="mt-6 max-w-3xl space-y-6">
          <AuthorSummary author={author as Author} />
          <p className="text-lg text-secondary-600">{description}</p>
        </div>

        <div className="mt-10">
          <AuthorCard author={author as Author} />
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {paginated.posts.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-secondary-200 bg-secondary-50 p-12 text-center">
              <h2 className="text-xl font-semibold text-secondary-900">
                No articles yet
              </h2>
              <p className="mt-2 text-secondary-600">
                {author.name} hasn't published articles just yet. Check back soon.
              </p>
            </div>
          ) : (
            paginated.posts.map((post) => <BlogCard key={post.slug} post={post} />)
          )}
        </div>

        <Pagination
          currentPage={paginated.page}
          pageCount={paginated.pageCount}
          getHref={(pageNumber) => buildAuthorPath(author.slug, pageNumber)}
        />
      </section>
    </>
  );
}

function buildAuthorPath(slug: string, page?: number) {
  if (page && page > 1) {
    return `/blog/author/${slug}?page=${page}`;
  }

  return `/blog/author/${slug}`;
}

function buildAuthorJsonLd(author: Author, canonicalUrl: string, siteName: string) {
  const social = author.social ?? {};
  const sameAs = [social.website, social.twitter, social.linkedin, social.github]
    .filter(Boolean)
    .map((value) => value as string);

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${author.name} — ${siteName}`,
    url: canonicalUrl,
    description: author.shortBio ?? AUTHOR_FALLBACK_DESCRIPTION,
    about: {
      "@type": "Person",
      name: author.name,
      url: canonicalUrl,
      sameAs: sameAs.length > 0 ? sameAs : undefined,
    },
  };
}
