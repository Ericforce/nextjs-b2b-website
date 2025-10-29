import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <article className="bg-white pb-24 pt-16">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            Blog Article
          </p>
          <h1 className="mt-4 text-3xl font-bold text-secondary-900">
            This article is unavailable
          </h1>
          <p className="mt-3 text-secondary-600">
            The article you&apos;re looking for may have been removed or is still in
            draft. Explore other stories from our team.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/blog" className="btn-primary">
              Browse blog
            </Link>
            <Link href="/" className="btn-outline">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
