import type { PortableTextBlock } from "@portabletext/types";
import type { LinkInternalAnnotation, LinkExternalAnnotation } from "../../types/sanity";

// Portable Text serializers for different use cases
export const portableTextSerializers = {
  // For rendering HTML
  default: {
    types: {
      image: ({ value }: { value: unknown }) => {
        const img = value as { url: string; alt?: string };
        return `<img src="${img.url}" alt="${img.alt || ""}" />`;
      },
      codeBlock: ({ value }: { value: unknown }) => {
        const code = value as { language?: string; code: string };
        return `<pre><code class="language-${code.language || "text"}">${code.code}</code></pre>`;
      },
    },
    marks: {
      linkInternal: ({ children, value }: { children: unknown; value: LinkInternalAnnotation }) => {
        const href = value.reference?.slug ? `/${value.reference.slug}` : "#";
        return `<a href="${href}">${children}</a>`;
      },
      linkExternal: ({ children, value }: { children: unknown; value: LinkExternalAnnotation }) => {
        return `<a href="${value.href}"${value.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ""}>${children}</a>`;
      },
    },
    block: ({ children }: { children: unknown }) => `<p>${children}</p>`,
    list: ({ children }: { children: unknown }) => `<ul>${children}</ul>`,
    listItem: ({ children }: { children: unknown }) => `<li>${children}</li>`,
  },

  // For plain text extraction
  plainText: {
    types: {
      image: () => "",
      codeBlock: () => "",
    },
    marks: {
      linkInternal: ({ children }: { children: unknown }) => children,
      linkExternal: ({ children }: { children: unknown }) => children,
    },
    block: ({ children }: { children: unknown }) => children,
    list: ({ children }: { children: unknown }) => children,
    listItem: ({ children }: { children: unknown }) => children,
  },

  // For SEO meta descriptions
  excerpt: {
    types: {
      image: () => "",
      codeBlock: () => "",
    },
    marks: {
      linkInternal: ({ children }: { children: unknown }) => children,
      linkExternal: ({ children }: { children: unknown }) => children,
    },
    block: ({ children }: { children: unknown }) => children,
    list: ({ children }: { children: unknown }) => children,
    listItem: ({ children }: { children: unknown }) => children,
  },
};

// Helper function to extract plain text from Portable Text
export function portableTextToPlainText(portableText?: PortableTextBlock[]): string {
  if (!portableText || portableText.length === 0) return "";

  return portableText
    .map((block) => {
      if (!block.children) return "";
      return block.children.map((child) => child.text || "").join("");
    })
    .join("\n");
}

// Helper function to extract excerpt from Portable Text
export function portableTextToExcerpt(
  portableText?: PortableTextBlock[],
  maxLength: number = 160
): string {
  const plainText = portableTextToPlainText(portableText);
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + "...";
}

// Helper function to get word count from Portable Text
export function getPortableTextWordCount(portableText?: PortableTextBlock[]): number {
  const plainText = portableTextToPlainText(portableText);
  return plainText.split(/\s+/).filter(word => word.length > 0).length;
}

// Helper function to estimate reading time (average 200 words per minute)
export function getPortableTextReadingTime(portableText?: PortableTextBlock[]): string {
  const wordCount = getPortableTextWordCount(portableText);
  const readingTime = Math.ceil(wordCount / 200);
  return `${readingTime} min read`;
}

// Helper function to validate Portable Text structure
export function isValidPortableText(
  data: unknown
): data is PortableTextBlock[] {
  if (!Array.isArray(data)) return false;

  return data.every(
    (block) =>
      typeof block === "object" &&
      block !== null &&
      "_type" in block &&
      "children" in block &&
      Array.isArray(block.children)
  );
}