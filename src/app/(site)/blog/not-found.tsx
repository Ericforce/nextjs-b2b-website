import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="bg-white pb-24 pt-16">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            Blog
          </p>
          <h1 className="mt-4 text-3xl font-bold text-secondary-900">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-3 text-secondary-600">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Explore our latest articles or head back to the blog index.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/blog" className="btn-primary">
              Back to blog
            </Link>
            <Link href="/" className="btn-outline">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
