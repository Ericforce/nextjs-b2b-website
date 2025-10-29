import Link from "next/link";

export function PreviewBanner() {
  return (
    <div className="bg-secondary-900 text-white">
      <div className="container-custom flex flex-col gap-2 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <span className="font-medium">Preview mode is enabled.</span>
        <Link
          href="/api/preview/exit"
          className="inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-white/10"
        >
          Exit preview
        </Link>
      </div>
    </div>
  );
}
