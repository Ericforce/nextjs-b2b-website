import Link from "next/link";

import {
  buildBlogUrl,
  type BlogSearchParams,
} from "@/components/blog/utils";
import { cn } from "@/lib/utils";

interface PaginationItem {
  type: "page" | "ellipsis";
  value?: number;
}

function createPaginationItems(page: number, pageCount: number): PaginationItem[] {
  const items: PaginationItem[] = [];

  if (pageCount <= 1) {
    return items;
  }

  const siblingCount = 1;
  const firstPage = 1;
  const lastPage = pageCount;
  const leftSibling = Math.max(page - siblingCount, firstPage);
  const rightSibling = Math.min(page + siblingCount, lastPage);
  const shouldShowLeftEllipsis = leftSibling > firstPage + 1;
  const shouldShowRightEllipsis = rightSibling < lastPage - 1;

  items.push({ type: "page", value: firstPage });

  if (shouldShowLeftEllipsis) {
    items.push({ type: "ellipsis" });
  } else {
    for (let i = firstPage + 1; i < leftSibling; i += 1) {
      items.push({ type: "page", value: i });
    }
  }

  for (let i = leftSibling; i <= rightSibling; i += 1) {
    if (i !== firstPage && i !== lastPage) {
      items.push({ type: "page", value: i });
    }
  }

  if (shouldShowRightEllipsis) {
    items.push({ type: "ellipsis" });
  } else {
    for (let i = rightSibling + 1; i < lastPage; i += 1) {
      items.push({ type: "page", value: i });
    }
  }

  if (lastPage !== firstPage) {
    items.push({ type: "page", value: lastPage });
  }

  return items;
}

export interface PaginationProps {
  basePath?: string;
  page: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchParams?: BlogSearchParams;
}

export function Pagination({
  basePath = "/blog",
  page,
  pageCount,
  hasNextPage,
  hasPreviousPage,
  searchParams = {},
}: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const paginationItems = createPaginationItems(page, pageCount);

  const createHref = (targetPage: number) =>
    buildBlogUrl(basePath, searchParams, {
      page: targetPage > 1 ? String(targetPage) : undefined,
    });

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-4"
      aria-label="Pagination"
    >
      <Link
        href={createHref(Math.max(1, page - 1))}
        aria-disabled={!hasPreviousPage}
        className={cn(
          "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          hasPreviousPage
            ? "border-secondary-200 bg-white text-secondary-700 hover:border-primary-200 hover:text-primary-700"
            : "pointer-events-none border-secondary-100 bg-secondary-50 text-secondary-300"
        )}
      >
        Previous
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        {paginationItems.map((item, index) =>
          item.type === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-sm text-secondary-400"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <Link
              key={item.value}
              href={createHref(item.value!)}
              aria-current={item.value === page ? "page" : undefined}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
                item.value === page
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-secondary-600 hover:bg-primary-50 hover:text-primary-700"
              )}
            >
              {item.value}
            </Link>
          )
        )}
      </div>

      <Link
        href={createHref(Math.min(pageCount, page + 1))}
        aria-disabled={!hasNextPage}
        className={cn(
          "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          hasNextPage
            ? "border-secondary-200 bg-white text-secondary-700 hover:border-primary-200 hover:text-primary-700"
            : "pointer-events-none border-secondary-100 bg-secondary-50 text-secondary-300"
        )}
      >
        Next
      </Link>
    </nav>
  );
}
