"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import type { BlogCategory, BlogTag } from "@/types/blog";

interface BlogFiltersProps {
  categories: BlogCategory[];
  tags: BlogTag[];
  selectedCategory?: string | null;
  selectedTag?: string | null;
}

export default function BlogFilters({
  categories,
  tags,
  selectedCategory,
  selectedTag,
}: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const hasActiveFilters = Boolean(selectedCategory || selectedTag);

  const formattedCategories = useMemo(
    () => categories.filter((category) => category.slug),
    [categories]
  );

  const formattedTags = useMemo(
    () => tags.filter((tag) => tag.slug),
    [tags]
  );

  const updateFilters = (key: "category" | "tag", value?: string) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    const queryString = params.toString();

    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("category");
    params.delete("tag");
    params.delete("page");

    const queryString = params.toString();

    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-secondary-700">
            Category
            <div className="relative">
              <select
                className="w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-secondary-700 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-neutral-100"
                value={selectedCategory ?? ""}
                onChange={(event) => updateFilters("category", event.target.value || undefined)}
                disabled={isPending}
              >
                <option value="">All categories</option>
                {formattedCategories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.title}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondary-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.24a.75.75 0 01-1.06 0l-4.24-4.24a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-secondary-700">
            Tag
            <div className="relative">
              <select
                className="w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-secondary-700 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-neutral-100"
                value={selectedTag ?? ""}
                onChange={(event) => updateFilters("tag", event.target.value || undefined)}
                disabled={isPending}
              >
                <option value="">All tags</option>
                {formattedTags.map((tag) => (
                  <option key={tag.id} value={tag.slug}>
                    {tag.title}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-secondary-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.24a.75.75 0 01-1.06 0l-4.24-4.24a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-secondary-500">
            {isPending ? "Updating results..." : "Refine your feed with filters."}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
