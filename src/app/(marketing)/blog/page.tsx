import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { getAllBlogPosts } from "@/lib/sanity";
import {
  absoluteUrl,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  await getMetadataDefaults();
  return generatePageMetadata({
    title: "Insights from the Next.js B2B Team",
    description:
      "The latest stories, product updates, and best practices from the Next.js B2B Application team.",
    canonicalPath: "/blog",
  });
}

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();
  const orderedPosts = [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const { siteSettings } = await getMetadataDefaults();
  const canonical = absoluteUrl("/blog", siteSettings.siteUrl);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteSettings.siteName} Blog`,
    url: canonical,
    description:
      "Stories and updates from the team behind the Next.js B2B Application.",
    blogPost: orderedPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: absoluteUrl(`/blog/${post.slug}`, siteSettings.siteUrl),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
    })),
  };

  return (
    <>
      <Script {...jsonLdScriptProps("blog-index-jsonld", jsonLd)} />
      <section className="container-custom mx-auto max-w-5xl py-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-wide text-primary-600">
            Insights
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900">
            Latest from the team
          </h1>
          <p className="mt-4 text-lg text-secondary-600">
            Field notes, product announcements, and best practices for modern
            B2B teams.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {orderedPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-secondary-200 p-8 transition-shadow hover:shadow-lg"
            >
              <span className="text-sm font-medium uppercase tracking-wide text-primary-600">
                {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              <h2 className="mt-4 text-2xl font-semibold text-secondary-900">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-3 text-secondary-600">{post.excerpt}</p>
              <p className="mt-4 text-sm text-secondary-500">
                By {post.author.name}
              </p>
              <div className="mt-6 text-sm font-medium text-primary-600">
                Read more →
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
