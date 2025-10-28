import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function normaliseBasePath(path: string): string {
  if (!path) return "/blog";
  return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
}

function createHref(basePath: string, page: number): string {
  if (page <= 1) {
    return basePath;
  }

  return `${basePath}/page/${page}`;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const safeBasePath = normaliseBasePath(basePath);
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="blog-pagination" aria-label="Blog pagination">
      <ul>
        <li>
          {previousPage ? (
            <Link href={createHref(safeBasePath, previousPage)} className="blog-pagination__link">
              Previous
            </Link>
          ) : (
            <span className="blog-pagination__link blog-pagination__link--disabled">Previous</span>
          )}
        </li>
        {pages.map((page) => (
          <li key={page}>
            {page === currentPage ? (
              <span className="blog-pagination__link blog-pagination__link--current" aria-current="page">
                {page}
              </span>
            ) : (
              <Link href={createHref(safeBasePath, page)} className="blog-pagination__link">
                {page}
              </Link>
            )}
          </li>
        ))}
        <li>
          {nextPage ? (
            <Link href={createHref(safeBasePath, nextPage)} className="blog-pagination__link">
              Next
            </Link>
          ) : (
            <span className="blog-pagination__link blog-pagination__link--disabled">Next</span>
          )}
        </li>
      </ul>
    </nav>
  );
}
