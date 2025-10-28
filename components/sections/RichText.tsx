import { PortableText } from '@portabletext/react';
import { RichTextSection } from '@/types/sanity';

const components = {
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{children}</h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-lg leading-8 text-gray-700 mb-4">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-900">{children}</code>
    ),
    link: ({ children, value }: { children?: React.ReactNode; value?: { href: string } }) => (
      <a href={value?.href} className="text-blue-600 hover:text-blue-700 underline">
        {children}
      </a>
    ),
  },
};

export function RichText({ content }: RichTextSection) {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <PortableText value={content} components={components} />
        </div>
      </div>
    </section>
  );
}
