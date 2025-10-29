import type { FeatureGridSection as FeatureGridSectionType } from "@/types/sanity";
import { cn } from "@/lib/utils/cn";

interface FeatureGridSectionProps {
  section: FeatureGridSectionType;
}

export default function FeatureGridSection({
  section,
}: FeatureGridSectionProps) {
  const { title, description, features, backgroundColor } = section;

  const backgroundClass = backgroundColor || "bg-white";

  return (
    <section className={cn(backgroundClass, "py-16 lg:py-24")}>
      <div className="container-custom">
        {title || description ? (
          <div className="mx-auto max-w-2xl text-center">
            {title ? (
              <h2 className="text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-lg text-secondary-600">{description}</p>
            ) : null}
          </div>
        ) : null}

        {features && features.length > 0 ? (
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature._key || feature.title} className="card">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <div className="h-6 w-6 rounded bg-primary-600"></div>
                </div>
                {feature.title ? (
                  <h3 className="mt-4 text-lg font-semibold text-secondary-900">
                    {feature.title}
                  </h3>
                ) : null}
                {feature.description ? (
                  <p className="mt-2 text-sm text-secondary-600">
                    {feature.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
