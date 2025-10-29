import Image from "next/image";
import Link from "next/link";

import { PortableText } from "@/components/portable-text";
import { cn } from "@/lib/utils";
import type { BlogAuthor } from "@/types";

export type Author = BlogAuthor;

export function AuthorSummary({ author }: { author: Author }) {
  return (
    <div className="flex items-center gap-4">
      <AuthorAvatar author={author} size={64} />
      <div>
        <p className="text-sm font-semibold text-secondary-900">{author.name}</p>
        {author.title || author.role || author.company ? (
          <p className="text-sm text-secondary-500">
            {[author.title ?? author.role, author.company]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function AuthorCard({ author }: { author: Author }) {
  const hasPortableBio = Array.isArray(author.bio) && author.bio.length > 0;
  const socialLinks = getAuthorSocialLinks(author);

  return (
    <section className="rounded-3xl border border-secondary-200 bg-secondary-50 p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <AuthorAvatar author={author} size={80} className="md:self-start" />
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-secondary-900">{author.name}</h3>
            {author.title || author.role || author.company ? (
              <p className="text-sm text-secondary-500">
                {[author.title ?? author.role, author.company]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
          </div>

          {!hasPortableBio && author.shortBio ? (
            <p className="text-secondary-600">{author.shortBio}</p>
          ) : null}

          {hasPortableBio ? (
            <PortableText value={author.bio} className="text-secondary-600" />
          ) : null}

          {socialLinks.length > 0 ? (
            <div className="flex flex-wrap gap-3 text-sm">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-600 transition-colors hover:text-primary-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function AuthorAvatar({
  author,
  size = 64,
  className,
}: {
  author: Author;
  size?: number;
  className?: string;
}) {
  const dimension = size;

  if (author.image?.url) {
    return (
      <Image
        src={author.image.url}
        alt={author.image.alt ?? author.name}
        width={author.image.width ?? dimension}
        height={author.image.height ?? dimension}
        className={cn(
          "rounded-full object-cover",
          className,
          size >= 64 ? "h-16 w-16" : "h-12 w-12"
        )}
        style={{ width: dimension, height: dimension }}
        placeholder={author.image.lqip ? "blur" : undefined}
        blurDataURL={author.image.lqip}
      />
    );
  }

  const initials = author.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "A";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white",
        className
      )}
      style={{ width: dimension, height: dimension }}
    >
      {initials}
    </div>
  );
}

function getAuthorSocialLinks(author: Author) {
  const links = [] as { label: string; href: string }[];
  const social = author.social ?? {};

  if (social.website) {
    links.push({ label: "Website", href: social.website });
  }

  if (social.twitter) {
    links.push({ label: "Twitter", href: social.twitter });
  }

  if (social.linkedin) {
    links.push({ label: "LinkedIn", href: social.linkedin });
  }

  if (social.github) {
    links.push({ label: "GitHub", href: social.github });
  }

  return links;
}
