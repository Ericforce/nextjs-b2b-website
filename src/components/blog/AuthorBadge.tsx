import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { AuthorDocument, SiteSocialLinks } from "@/types";

const SOCIAL_LABELS: Record<keyof SiteSocialLinks, string> = {
  twitter: "Twitter",
  linkedin: "LinkedIn",
  github: "GitHub",
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
};

function resolveSocialLinks(social?: SiteSocialLinks) {
  if (!social) {
    return [] as Array<{ key: keyof SiteSocialLinks; href: string }>;
  }

  return (Object.entries(social) as Array<[keyof SiteSocialLinks, string | undefined]>)
    .filter(([, href]) => typeof href === "string" && href.trim().length > 0)
    .map(([key, href]) => ({ key, href: href!.trim() }));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export interface AuthorBadgeProps {
  author?: AuthorDocument | null;
  className?: string;
  compact?: boolean;
  showLinks?: boolean;
  showRole?: boolean;
}

export function AuthorBadge({
  author,
  className,
  compact = false,
  showLinks = false,
  showRole = true,
}: AuthorBadgeProps) {
  if (!author) {
    return null;
  }

  const socialLinks = resolveSocialLinks(author.social);
  const hasLinks = showLinks && (Boolean(author.website) || socialLinks.length > 0);

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        compact ? "gap-3" : "gap-4",
        className
      )}
    >
      <Link
        href={`/blog/author/${author.slug}`}
        className={cn(
          "relative flex-shrink-0 overflow-hidden rounded-full bg-primary-100",
          compact ? "h-10 w-10" : "h-12 w-12"
        )}
        aria-label={`Read more from ${author.name}`}
      >
        {author.image?.url ? (
          <Image
            src={author.image.url}
            alt={author.image.alt ?? author.name}
            fill
            sizes="48px"
            className="object-cover"
            priority={false}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary-700">
            {getInitials(author.name)}
          </span>
        )}
      </Link>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/blog/author/${author.slug}`}
            className={cn(
              "font-medium text-secondary-900 transition-colors hover:text-primary-600",
              compact ? "text-sm" : "text-base"
            )}
          >
            {author.name}
          </Link>
          {showRole && author.role ? (
            <span className="text-sm text-secondary-500">{author.role}</span>
          ) : null}
        </div>
        {author.bio && !compact ? (
          <p className="mt-1 line-clamp-2 text-sm text-secondary-500">
            {author.bio}
          </p>
        ) : null}
        {hasLinks ? (
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-primary-600">
            {author.website ? (
              <Link
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary-700"
              >
                Website
              </Link>
            ) : null}
            {socialLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary-700"
              >
                {SOCIAL_LABELS[key] ?? key}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
