import { PortableText } from "@portabletext/react";
import type { RichTextSection as RichTextSectionType } from "@/types/sanity";
import { cn } from "@/lib/utils/cn";

interface RichTextSectionProps {
  section: RichTextSectionType;
}

export default function RichTextSection({ section }: RichTextSectionProps) {
  const { title, content, backgroundColor } = section;

  const backgroundClass = backgroundColor || "bg-white";

  if (!content || content.length === 0) {
    return null;
  }

  return (
    <section className={cn(backgroundClass, "py-16 lg:py-24")}>
      <div className="container-custom">
        <div className="prose prose-lg prose-primary mx-auto max-w-3xl">
          {title ? (
            <h2 className="text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl">
              {title}
            </h2>
          ) : null}
          <PortableText
            value={content}
            components={{
              block: {
                h1: ({ children }) => (
                  <h1 className="mt-8 text-4xl font-bold text-secondary-900">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-8 text-3xl font-bold text-secondary-900">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-6 text-2xl font-semibold text-secondary-900">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="mt-6 text-xl font-semibold text-secondary-900">
                    {children}
                  </h4>
                ),
                normal: ({ children }) => (
                  <p className="mt-4 text-base leading-7 text-secondary-700">
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="mt-6 border-l-4 border-primary-600 pl-4 italic text-secondary-700">
                    {children}
                  </blockquote>
                ),
              },
              marks: {
                strong: ({ children }) => (
                  <strong className="font-semibold text-secondary-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => (
                  <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm font-mono text-primary-700">
                    {children}
                  </code>
                ),
                link: ({ children, value }) => (
                  <a
                    href={value?.href}
                    target={value?.blank ? "_blank" : undefined}
                    rel={value?.blank ? "noreferrer" : undefined}
                    className="text-primary-600 underline hover:text-primary-700"
                  >
                    {children}
                  </a>
                ),
              },
              list: {
                bullet: ({ children }) => (
                  <ul className="mt-4 list-disc space-y-2 pl-6">{children}</ul>
                ),
                number: ({ children }) => (
                  <ol className="mt-4 list-decimal space-y-2 pl-6">
                    {children}
                  </ol>
                ),
              },
            }}
          />
        </div>
      </div>
    </section>
  );
}
