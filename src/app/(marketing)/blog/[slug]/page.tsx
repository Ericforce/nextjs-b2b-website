import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/sanity";
import {
  absoluteUrl,
  buildArticleJsonLd,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const documents = await getAllBlogPosts();
  return documents.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return generatePageMetadata({
    title: post.title,
    description: post.excerpt,
    seo: post.seo,
    canonicalPath: post.seo?.canonical ?? `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
    authors: [post.author.name],
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const { siteSettings } = await getMetadataDefaults();
  const canonicalUrl = absoluteUrl(
    post.seo?.canonical ?? `/blog/${post.slug}`,
    siteSettings.siteUrl
  );
  const jsonLd = buildArticleJsonLd(post, canonicalUrl, siteSettings);

  return (
    <>
      <Script {...jsonLdScriptProps(`article-jsonld-${post.slug}`, jsonLd)} />
      <article className="container-custom mx-auto max-w-3xl py-16 lg:py-24">
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-wide text-primary-600">
            Blog
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-secondary-900">
            {post.title}
          </h1>
          <p className="text-lg text-secondary-600">{post.excerpt}</p>
          <div className="text-sm text-secondary-500">
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            {post.readingTime ? (
              <>
                <span className="mx-2">•</span>
                <span>{post.readingTime}</span>
              </>
            ) : null}
          </div>
          <div className="text-sm text-secondary-500">
            By {post.author.name}
          </div>
        </header>

        <div className="mt-12 space-y-8">{renderPortableText(post.body)}</div>
      </article>
    </>
  );
}

function renderPortableText(body: string) {
  const sections = body.split(/\n\n+/);

  return sections.map((section, index) => {
    const lines = section.split("\n").filter(Boolean);
    if (lines.length === 0) {
      return null;
    }

    const headingLine = lines[0];
    if (headingLine.startsWith("## ")) {
      const heading = headingLine.replace(/^##\s*/, "");
      const contentLines = lines.slice(1);
      const allListItems =
        contentLines.length > 0 &&
        contentLines.every((line) => line.trim().startsWith("- "));

      return (
        <section key={`${heading}-${index}`} className="space-y-4">
          <h2 className="text-2xl font-semibold text-secondary-900">
            {heading}
          </h2>
          {allListItems ? (
            <ul className="ml-6 list-disc space-y-2 text-secondary-600">
              {contentLines.map((line, lineIndex) => (
                <li key={lineIndex}>{line.replace(/^[-*]\s*/, "")}</li>
              ))}
            </ul>
          ) : contentLines.length > 0 ? (
            <p className="text-secondary-600">
              {contentLines.join(" ").trim()}
            </p>
          ) : null}
        </section>
      );
    }

    if (lines.every((line) => line.trim().startsWith("- "))) {
      return (
        <ul
          key={`list-${index}`}
          className="ml-6 list-disc space-y-2 text-secondary-600"
        >
          {lines.map((line, lineIndex) => (
            <li key={lineIndex}>{line.replace(/^[-*]\s*/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`paragraph-${index}`} className="text-secondary-600">
        {section.replace(/^##\s*/, "").trim()}
      </p>
    );
  });
}
