import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { SectionRenderer } from '@/components/SectionRenderer';
import { getSamplePage, getSampleSlugs } from '@/lib/sampleContent';
import { sanityFetch, isSanityConfigured } from '@/lib/sanity/client';
import { PAGE_BY_SLUG_QUERY, PAGE_SLUGS_QUERY } from '@/lib/sanity/queries';
import type { Page } from '@/types/sanity';

interface PageProps {
  params: {
    slug?: string[];
  };
}

export const revalidate = 60;

function getSlugCandidates(slugSegments: string[]): string[] {
  if (!slugSegments.length) {
    return ['/', '', 'home'];
  }

  const joined = slugSegments.join('/');
  return Array.from(new Set([joined, `/${joined}`]));
}

async function fetchSanityPage(slugSegments: string[]): Promise<Page | null> {
  if (!isSanityConfigured) {
    return null;
  }

  const slugCandidates = getSlugCandidates(slugSegments);

  try {
    const page = await sanityFetch<Page | null>({
      query: PAGE_BY_SLUG_QUERY,
      params: { slugs: slugCandidates },
      revalidate,
      tags: slugCandidates.map((slug) => `page:${slug || 'home'}`),
    });

    return page ?? null;
  } catch (error) {
    console.error('Error fetching page from Sanity:', error);
    return null;
  }
}

export async function generateStaticParams() {
  if (!isSanityConfigured) {
    return getSampleSlugs().map((slug) => ({ slug }));
  }

  try {
    const pages = await sanityFetch<{ segments: string[] }[]>({
      query: PAGE_SLUGS_QUERY,
      revalidate: 3600,
    });

    const params = pages.map((page) => ({ slug: page.segments ?? [] }));

    const hasRoot = params.some((param) => !param.slug || param.slug.length === 0);
    if (!hasRoot) {
      params.push({ slug: [] });
    }

    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return getSampleSlugs().map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slugSegments = params.slug ?? [];

  const page = (await fetchSanityPage(slugSegments)) ?? getSamplePage(slugSegments);

  if (!page) {
    return {
      title: 'Page not found',
    };
  }

  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription || page.description,
  };
}

export default async function Page({ params }: PageProps) {
  const slugSegments = params.slug ?? [];
  const page = (await fetchSanityPage(slugSegments)) ?? getSamplePage(slugSegments);

  if (!page) {
    notFound();
  }

  return (
    <main>
      <SectionRenderer sections={page.sections} />
    </main>
  );
}
