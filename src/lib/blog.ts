import type { PortableText } from "@/types";

const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(blocks: PortableText | undefined) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  const text = blocks
    .map((block) => {
      if (block._type !== "block" || !Array.isArray(block.children)) {
        return "";
      }

      return block.children
        .map((child) => (typeof child.text === "string" ? child.text : ""))
        .join(" ");
    })
    .join(" ");

  const words = text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return null;
  }

  return Math.max(1, Math.round(words.length / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number | null | undefined) {
  if (!minutes || minutes <= 0) {
    return null;
  }

  return `${minutes} min read`;
}
