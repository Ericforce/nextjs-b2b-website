import Link from "next/link";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams?: Record<string, string | string[] | undefined>;
  basePath?: string;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  searchParams = {},
  basePath = "/blog",
}: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const createHref = (page: number) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key === "page") {
        return;
      }

      if (Array.isArray(value)) {
        if (value.length > 0 && value[0]) {
          params.set(key, value[0]);
        }
        return;
      }

      if (typeof value === "string" && value.length > 0) {
        params.set(key, value);
      }
    });

    if (page > 1) {
      params.set("page", page.toString());
    }

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const pages: number[] = (() => {
    const range: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let page = start; page <= end; page += 1) {
      range.push(page);
    }

    if (!range.includes(1)) {
      range.unshift(1);
    }

    if (!range.includes(totalPages)) {
      range.push(totalPages);
    }

    return Array.from(new Set(range)).sort((a, b) => a - b);
  })();

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <nav className="flex items-center justify-between gap-4 rounded-3xl border border-neutral-200 bg-white p-4 shadow-soft" aria-label="Pagination">
      <Link
        href={createHref(Math.max(1, currentPage - 1))}
        aria-disabled={isPrevDisabled}
        tabIndex={isPrevDisabled ? -1 : undefined}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
          isPrevDisabled
            ? "cursor-not-allowed text-neutral-400"
            : "text-secondary-600 hover:text-primary-600"
        }`}
      >
        <span aria-hidden="true">&larr;</span>
        Previous
      </Link>

      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          const isCurrent = page === currentPage;
          const previousPage = pages[index - 1];
          const hasGap = previousPage && page - previousPage > 1;

          return (
            <span key={page} className="flex items-center">
              {hasGap && <span className="px-2 text-sm text-secondary-400">&hellip;</span>}
              <Link
                href={createHref(page)}
                aria-current={isCurrent ? "page" : undefined}
                className={`inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl px-3 text-sm font-semibold transition-colors ${
                  isCurrent
                    ? "bg-primary-600 text-white shadow-soft"
                    : "text-secondary-600 hover:bg-primary-50 hover:text-primary-600"
                }`}
              >
                {page}
              </Link>
            </span>
          );
        })}
      </div>

      <Link
        href={createHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={isNextDisabled}
        tabIndex={isNextDisabled ? -1 : undefined}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
          isNextDisabled
            ? "cursor-not-allowed text-neutral-400"
            : "text-secondary-600 hover:text-primary-600"
        }`}
      >
        Next
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </nav>
  );
}
