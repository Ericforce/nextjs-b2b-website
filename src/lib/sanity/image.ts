import imageUrlBuilder from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { env } from "@/lib/env";
import { isSanityConfigured } from "./config";

let sharedImageBuilder: ImageUrlBuilder | null = null;

if (isSanityConfigured()) {
  sharedImageBuilder = imageUrlBuilder({
    projectId: env.sanity.projectId,
    dataset: env.sanity.dataset,
  });
}

export function getImageBuilder(): ImageUrlBuilder | null {
  return sharedImageBuilder;
}

export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!source || !sharedImageBuilder) {
    return null;
  }

  return sharedImageBuilder.image(source);
}
