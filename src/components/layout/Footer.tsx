import Link from "next/link";

import type {
  FooterSection,
  SanityImageAsset,
  SiteSocialLinks,
} from "@/types";

interface FooterProps {
  siteName?: string;
  description?: string;
  logo?: SanityImageAsset | null;
  footerSections?: FooterSection[];
  social?: SiteSocialLinks;
  copyrightText?: string;
}

const SOCIAL_LABELS: Record<keyof SiteSocialLinks, string> = {
  twitter: "Twitter",
  linkedin: "LinkedIn",
  github: "GitHub",
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
};

const SOCIAL_KEYS: Array<keyof SiteSocialLinks> = [
  "twitter",
  "linkedin",
  "github",
  "youtube",
  "facebook",
  "instagram",
];

function SocialIcon({ type }: { type: keyof SiteSocialLinks }) {
  switch (type) {
    case "twitter":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21 5.92a5.66 5.66 0 0 1-1.64.46 2.86 2.86 0 0 0 1.24-1.58 5.68 5.68 0 0 1-1.8.7 2.83 2.83 0 0 0-4.83 1.94c0 .22.03.45.07.66a8.05 8.05 0 0 1-5.85-2.96 2.83 2.83 0 0 0 .88 3.77 2.8 2.8 0 0 1-1.28-.35v.04a2.84 2.84 0 0 0 2.27 2.78 2.85 2.85 0 0 1-1.27.05 2.84 2.84 0 0 0 2.65 1.97A5.7 5.7 0 0 1 5 17.11a8.04 8.04 0 0 0 12.31-6.77c0-.12 0-.24-.01-.35A5.71 5.71 0 0 0 21 5.92Z"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 17.34H6V9.66h2.34Zm-1.17-8.86a1.36 1.36 0 1 1 0-2.72 1.36 1.36 0 0 1 0 2.72Zm10.17 8.86h-2.34v-3.66c0-.87-.02-1.98-1.21-1.98-1.21 0-1.4.95-1.4 1.92v3.72h-2.34V9.66h2.24v1.05h.03c.31-.6 1.08-1.24 2.22-1.24 2.37 0 2.81 1.56 2.81 3.58Z"
          />
        </svg>
      );
    case "github":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 0 0-3.16 19.5c.5.1.68-.22.68-.48v-1.7c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.54 1.05 1.54 1.05.9 1.53 2.36 1.09 2.94.84.09-.66.35-1.1.63-1.35-2.21-.25-4.55-1.1-4.55-4.9 0-1.1.39-2 .99-2.7-.1-.24-.43-1.24.09-2.58 0 0 .83-.26 2.74 1.03a9.5 9.5 0 0 1 5 0c1.9-1.29 2.73-1.03 2.73-1.03.52 1.34.19 2.34.09 2.58.62.7 1 1.6 1 2.7 0 3.8-2.34 4.64-4.57 4.89.36.31.68.92.68 1.86v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M21.6 7.2a2.5 2.5 0 0 0-1.74-1.76C18 5 12 5 12 5s-6 0-7.86.44A2.5 2.5 0 0 0 2.4 7.2 26.4 26.4 0 0 0 2 12a26.4 26.4 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.74 1.76C6 19 12 19 12 19s6 0 7.86-.44a2.5 2.5 0 0 0 1.74-1.76 26.4 26.4 0 0 0 .4-4.8 26.4 26.4 0 0 0-.4-4.8ZM10 15.25v-6.5L15.5 12Z"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.79c0-2.5 1.5-3.88 3.79-3.88.76 0 1.54.13 1.54.13v2.53h-.87c-.86 0-1.13.54-1.13 1.09V12h1.93l-.31 2.89h-1.62v6.99A10 10 0 0 0 22 12Z"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7Zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10Zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5Zm0 2A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Zm5-2.75a.75.75 0 1 0 .75.75.75.75 0 0 0-.75-.75Z"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer({
  siteName,
  description,
  logo,
  footerSections,
  social,
  copyrightText,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const resolvedSiteName = siteName ?? "B2B App";
  const siteDescription = description ??
    "Building modern B2B experiences with a flexible, content-driven architecture.";
  const sections = footerSections?.filter((section) =>
    (section?.links?.length ?? 0) > 0
  );

  const socialEntries = SOCIAL_KEYS.flatMap((key) => {
    const href = social?.[key];
    if (!href) {
      return [];
    }

    return [
      {
        key,
        href,
        label: SOCIAL_LABELS[key],
      },
    ];
  });

  const defaultCopyright = `© ${currentYear} ${resolvedSiteName}. All rights reserved.`;

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              {logo?.url ? (
                <img
                  src={logo.url}
                  alt={logo.alt ?? resolvedSiteName}
                  className="h-8 w-auto rounded-md object-contain"
                />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-primary-600" />
              )}
              <span className="text-xl font-bold text-secondary-900">
                {resolvedSiteName}
              </span>
            </Link>
            <p className="mt-4 text-sm text-secondary-600">{siteDescription}</p>
            {socialEntries.length > 0 && (
              <div className="mt-6 flex gap-4">
                {socialEntries.map((entry) => (
                  <a
                    key={entry.key}
                    href={entry.href}
                    className="text-secondary-500 transition-colors hover:text-primary-600"
                    aria-label={`Visit ${resolvedSiteName} on ${entry.label}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon type={entry.key} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {sections?.map((section) => (
            <div key={section.title ?? section.links[0]?.href ?? "links"}>
              {section.title && (
                <h3 className="text-sm font-semibold text-secondary-900">
                  {section.title}
                </h3>
              )}
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={`${section.title ?? "footer"}-${link.href}`}>
                    <Link
                      href={link.href}
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={
                        link.openInNewTab ? "noopener noreferrer" : undefined
                      }
                      className="text-sm text-secondary-600 transition-colors hover:text-primary-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-sm text-secondary-600">
              {copyrightText ?? defaultCopyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
