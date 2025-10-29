export default function BlogLoading() {
  return (
    <div className="bg-white pb-24 pt-16">
      <div className="container-custom space-y-12">
        <section className="space-y-4 text-center">
          <div className="mx-auto h-6 w-32 rounded-full bg-neutral-200" />
          <div className="mx-auto h-10 w-3/4 rounded-full bg-neutral-200" />
          <div className="mx-auto h-4 w-1/2 rounded-full bg-neutral-200" />
        </section>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[0, 1].map((item) => (
              <div key={item} className="space-y-2">
                <div className="h-4 w-24 rounded-full bg-neutral-200" />
                <div className="h-10 w-full rounded-xl bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft"
            >
              <div className="h-48 w-full bg-neutral-200" />
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="h-3 w-24 rounded-full bg-neutral-200" />
                <div className="h-6 w-3/4 rounded-full bg-neutral-200" />
                <div className="h-6 w-2/3 rounded-full bg-neutral-200" />
                <div className="mt-auto h-4 w-1/2 rounded-full bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
