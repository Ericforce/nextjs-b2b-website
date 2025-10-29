import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-secondary-900">
          Page not found
        </h2>
        <p className="mt-4 text-lg text-secondary-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-8">
          <Link href="/" className="btn-primary">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
