import Link from "next/link";

import type {
  AuthorDocument,
  CategoryDocument,
  TagDocument,
} from "@/types";
import { cn } from "@/lib/utils";
import {
  buildBlogUrl,
  type BlogSearchParams,
} from "@/components/blog/utils";

interface FilterItem {
  label: string;
  value: string;
  count?: number;
  href: string;
  isActive: boolean;
}

interface FilterGroupProps {
  title: string;
  items: FilterItem[];
}

function FilterGroup({ title, items }: FilterGroupProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary-500">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.value || "__all"}
            href={item.href}
            aria-current={item.isActive ? "true" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              item.isActive
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-secondary-200 bg-white text-secondary-600 hover:border-primary-200 hover:text-primary-700"
            )}
          >
            <span>{item.label}</span>
            {typeof item.count === "number" ? (
              <span className="rounded-full bg-secondary-100 px-2 py-0.5 text-[0.65rem] font-semibold text-secondary-600">
                {item.count}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}

export interface BlogFiltersProps {
  basePath?: string;
  categories: CategoryDocument[];
  tags: TagDocument[];
  authors: AuthorDocument[];
  activeCategory?: string | null;
  activeTag?: string | null;
  activeAuthor?: string | null;
  searchParams?: BlogSearchParams;
}

export function BlogFilters({
  basePath = "/blog",
  categories,
  tags,
  authors,
  activeCategory,
  activeTag,
  activeAuthor,
  searchParams = {},
}: BlogFiltersProps) {
  const hasActiveFilters = Boolean(
    (activeCategory && activeCategory.length > 0) ||
      (activeTag && activeTag.length > 0) ||
      (activeAuthor && activeAuthor.length > 0)
  );

  const categoryItems: FilterItem[] = [
    {
      label: "All categories",
      value: "",
      href: buildBlogUrl(basePath, searchParams, {
        category: undefined,
        page: undefined,
      }),
      isActive: !activeCategory,
    },
    ...categories.map((category) => ({
      label: category.title,
      value: category.slug,
      count: category.postCount,
      href: buildBlogUrl(basePath, searchParams, {
        category: activeCategory === category.slug ? undefined : category.slug,
        page: undefined,
      }),
      isActive: activeCategory === category.slug,
    })),
  ];

  const tagItems: FilterItem[] = [
    {
      label: "All tags",
      value: "",
      href: buildBlogUrl(basePath, searchParams, {
        tag: undefined,
        page: undefined,
      }),
      isActive: !activeTag,
    },
    ...tags.map((tag) => ({
      label: tag.title,
      value: tag.slug,
      count: tag.postCount,
      href: buildBlogUrl(basePath, searchParams, {
        tag: activeTag === tag.slug ? undefined : tag.slug,
        page: undefined,
      }),
      isActive: activeTag === tag.slug,
    })),
  ];

  const authorItems: FilterItem[] = [
    {
      label: "All authors",
      value: "",
      href: buildBlogUrl(basePath, searchParams, {
        author: undefined,
        page: undefined,
      }),
      isActive: !activeAuthor,
    },
    ...authors.map((author) => ({
      label: author.name,
      value: author.slug,
      href: buildBlogUrl(basePath, searchParams, {
        author: activeAuthor === author.slug ? undefined : author.slug,
        page: undefined,
      }),
      isActive: activeAuthor === author.slug,
    })),
  ];

  return (
    <section className="space-y-6 rounded-3xl border border-secondary-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            Filters
          </p>
          <h2 className="text-lg font-semibold text-secondary-900">
            Refine the articles you see
          </h2>
        </div>
        {hasActiveFilters ? (
          <Link
            href={buildBlogUrl(basePath, searchParams, {
              category: undefined,
              tag: undefined,
              author: undefined,
              page: undefined,
            })}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Clear filters
          </Link>
        ) : null}
      </div>

      <FilterGroup title="Categories" items={categoryItems} />
      <FilterGroup title="Tags" items={tagItems} />
      <FilterGroup title="Authors" items={authorItems} />
    </section>
  );
}
