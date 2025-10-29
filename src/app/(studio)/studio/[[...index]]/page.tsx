import { notFound } from "next/navigation";
import { NextStudio } from "next-sanity/studio";

import { env } from "@/lib/env";
import { sanityConfig } from "@/lib/sanity/config";

export { metadata, viewport } from "next-sanity/studio";

const isProduction = env.app.env === "production";

export default function StudioPage() {
  if (isProduction) {
    notFound();
  }

  return <NextStudio config={sanityConfig} />;
}
