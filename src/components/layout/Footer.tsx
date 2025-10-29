import Image from "next/image";
import Link from "next/link";
import {
  footerSections as fallbackFooterSections,
  socialLinks as fallbackSocialLinks,
} from "@/data/navigation";
import type { SanitySiteSettings } from "@/types/sanity";

interface FooterProps {
  settings?: SanitySiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const branding = settings?.branding || {
    name: "B2B App",
    href: "/",
  };

  const footerSections = settings?.footer?.sections || fallbackFooterSections;
  const socialLinks = settings?.footer?.social || fallbackSocialLinks;
  const footerDescription =
    settings?.footer?.description ||
    "Building the future of B2B solutions with modern technology and innovative approaches.";
  const copyright =
    settings?.footer?.copyright ||
    `© ${currentYear} B2B App. All rights reserved.`;

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link
              href={branding.href || "/"}
              className="flex items-center space-x-2"
            >
              {branding.logo?.url ? (
                <Image
                  src={branding.logo.url}
                  alt={branding.logo.alt || branding.name || "Logo"}
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-primary-600"></div>
              )}
              {branding.name ? (
                <span className="text-xl font-bold text-secondary-900">
                  {branding.name}
                </span>
              ) : null}
            </Link>
            {footerDescription ? (
              <p className="mt-4 text-sm text-secondary-600">
                {footerDescription}
              </p>
            ) : null}
            {socialLinks && socialLinks.length > 0 ? (
              <div className="mt-6 flex gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.icon || link.label}
                    href={link.href}
                    className="text-secondary-500 hover:text-primary-600 transition-colors"
                    aria-label={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-secondary-900">
                {section.title}
              </h3>
              {section.links && section.links.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-secondary-600 hover:text-primary-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-secondary-600">{copyright}</p>
            <div className="flex gap-6 text-sm text-secondary-600">
              <Link
                href="/privacy"
                className="hover:text-primary-600 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary-600 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="hover:text-primary-600 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
