export default function BlogPostLoading() {
  return (
    <article className="bg-white pb-24 pt-16">
      <div className="container-custom grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="h-4 w-32 rounded-full bg-neutral-200" />
            <div className="h-12 w-3/4 rounded-full bg-neutral-200" />
            <div className="h-6 w-1/2 rounded-full bg-neutral-200" />
          </div>

          <div className="h-96 w-full rounded-4xl bg-neutral-200" />

          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-4 w-full rounded-full bg-neutral-200" />
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="h-6 w-40 rounded-full bg-neutral-200" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-4 w-3/4 rounded-full bg-neutral-200" />
            ))}
          </div>
        </aside>
      </div>
    </article>
  );
}
