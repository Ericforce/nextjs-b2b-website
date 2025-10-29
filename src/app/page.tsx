import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/sections";
import { fetchPageBySlug, fetchReusableSections } from "@/lib/sanity/api/page";
import { resolvePageSections } from "@/lib/sanity/api/sections";
import { buildMetadataForSlug } from "./(site)/page-metadata";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadataForSlug("index");
}

export default async function Home() {
  const { isEnabled } = draftMode();
  const [page, reusableSections] = await Promise.all([
    fetchPageBySlug("index", isEnabled),
    fetchReusableSections(isEnabled),
  ]);

  if (!page) {
    notFound();
  }

  const sections = resolvePageSections(page, reusableSections);

  if (!sections || sections.length === 0) {
    notFound();
  }

  return <SectionRenderer sections={sections} />;
}
