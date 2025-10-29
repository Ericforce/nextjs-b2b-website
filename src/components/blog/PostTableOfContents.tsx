import type { PortableTextBlock } from "@portabletext/types";
import Link from "next/link";
import { slugify } from "@/lib/utils";

interface PostTableOfContentsProps {
  blocks?: PortableTextBlock[];
}

interface HeadingItem {
  id: string;
  text: string;
  level: 2 | 3;
}

const extractHeadingText = (block: PortableTextBlock): string => {
  const children = (block as { children?: Array<{ text?: string }> }).children ?? [];
  return children
    .map((child) => child?.text ?? "")
    .join(" ")
    .trim();
};

export default function PostTableOfContents({
  blocks = [],
}: PostTableOfContentsProps) {
  const headings: HeadingItem[] = blocks
    .filter((block) => block._type === "block" && ["h2", "h3"].includes(block.style ?? ""))
    .map((block) => {
      const text = extractHeadingText(block);
      const id = slugify(text || block._key || "section");
      const level = (block.style === "h3" ? 3 : 2) as 2 | 3;
      return { id, text, level };
    })
    .filter((heading) => heading.id && heading.text);

  if (headings.length < 2) {
    return null;
  }

  return (
    <nav className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-wide text-secondary-500">
        On this page
      </p>
      <ul className="mt-4 space-y-2 text-sm text-secondary-600">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-4" : undefined}>
            <Link
              href={`#${heading.id}`}
              className="inline-flex items-center text-secondary-600 transition-colors hover:text-primary-600"
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
