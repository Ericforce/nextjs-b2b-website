import type { PortableTextBlock } from "@portabletext/types";

const WORDS_PER_MINUTE = 200;

export function getPlainTextFromPortableText(
  blocks: PortableTextBlock[] = []
): string {
  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") {
        return "";
      }

      const children = (block as { children?: Array<{ text?: string }> }).children;
      if (!children || !Array.isArray(children)) {
        return "";
      }

      return children
        .map((child) => (child?.text ? String(child.text) : ""))
        .join("");
    })
    .join("\n");
}

export function calculateReadingTime(text?: string | null): number {
  if (!text) {
    return 0;
  }

  const words = text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length;

  if (!words) {
    return 0;
  }

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
