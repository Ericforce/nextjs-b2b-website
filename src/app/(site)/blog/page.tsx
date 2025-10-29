import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import BlogCard from "@/components/blog/BlogCard";
import BlogFilters from "@/components/blog/BlogFilters";
import BlogPagination from "@/components/blog/BlogPagination";
import { fetchBlogIndex, fetchCategories, fetchTags } from "@/lib/sanity";
import type { BlogPostSummary } from "@/types/blog";

export const revalidate = 60;

const PAGE_SIZE = 9;

type BlogSearchParams = Record<string, string | string[] | undefined>;

const getParamValue = (value?: string | string[]): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export default async function BlogPage({
  searchParams = {},
}: {
  searchParams?: BlogSearchParams;
}) {
  const { isEnabled: preview } = draftMode();

  const category = getParamValue(searchParams.category);
  const tag = getParamValue(searchParams.tag);
  const pageParam = getParamValue(searchParams.page);
  const page = pageParam ? Math.max(parseInt(pageParam, 10) || 1, 1) : 1;

  const [{ posts, total }, categories, tags] = await Promise.all([
    fetchBlogIndex({
      page,
      limit: PAGE_SIZE,
      categorySlug: category || null,
      tagSlug: tag || null,
      preview,
    }),
    fetchCategories(preview),
    fetchTags(preview),
  ]);

  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 0;

  if (page > 1 && (totalPages === 0 || page > totalPages)) {
    notFound();
  }

  return (
    <div className="bg-white pb-24 pt-16">
      <div className="container-custom space-y-12">
        <section className="space-y-6 text-center">
          <span className="inline-flex items-center rounded-full bg-primary-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
            Insights & Updates
          </span>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl">
            Explore our latest blog posts
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-secondary-600">
            Discover product updates, best practices, and expert insights to
            help your team stay ahead.
          </p>
        </section>

        {preview ? (
          <div className="rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-700">
            Preview mode active. You&apos;re seeing draft content.
          </div>
        ) : null}

        <BlogFilters
          categories={categories}
          tags={tags}
          selectedCategory={category || null}
          selectedTag={tag || null}
        />

        <section className="space-y-8">
          {posts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
              <h2 className="text-2xl font-semibold text-secondary-900">
                No posts found
              </h2>
              <p className="mt-2 text-secondary-600">
                Try adjusting your filters or check back soon for new content.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post: BlogPostSummary) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {totalPages > 1 ? (
          <BlogPagination
            currentPage={page}
            totalPages={totalPages}
            searchParams={searchParams}
          />
        ) : null}
      </div>
    </div>
  );
}
