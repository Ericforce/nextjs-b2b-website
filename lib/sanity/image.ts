import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { createImageUrlBuilder } from "next-sanity";

import { sanityClient } from "./client";

const builder: ImageUrlBuilder | null = sanityClient ? createImageUrlBuilder(sanityClient) : null;

export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!source || !builder) {
    return null;
  }

  return builder.image(source).auto("format").fit("max");
}
