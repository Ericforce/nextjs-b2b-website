"use client";

import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils/cn";
import type { CallToAction, NavigationLink, SanityImageAsset } from "@/types";

interface HeaderProps {
  siteName?: string;
  logo?: SanityImageAsset | null;
  navigation?: NavigationLink[];
  secondaryNavigation?: NavigationLink[];
  headerCta?: CallToAction | null;
}

const CTA_BASE_CLASSES =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors";

const CTA_VARIANT_CLASSES: Record<
  NonNullable<CallToAction["variant"]>,
  string
> = {
  primary: cn(CTA_BASE_CLASSES, "btn-primary text-base"),
  secondary: cn(
    CTA_BASE_CLASSES,
    "border border-neutral-200 bg-white text-secondary-900 hover:bg-neutral-50"
  ),
  ghost: cn(
    CTA_BASE_CLASSES,
    "bg-transparent text-primary-600 hover:bg-primary-50"
  ),
  link: "text-sm font-semibold text-primary-600 hover:text-primary-700",
};

function getCtaClass(variant?: CallToAction["variant"]) {
  if (!variant) {
    return CTA_VARIANT_CLASSES.primary;
  }

  if (variant in CTA_VARIANT_CLASSES) {
    return CTA_VARIANT_CLASSES[variant as keyof typeof CTA_VARIANT_CLASSES];
  }

  return CTA_VARIANT_CLASSES.primary;
}

function renderNavLink(
  item: NavigationLink,
  onNavigate?: () => void,
  className?: string
) {
  const target = item.openInNewTab ? "_blank" : undefined;
  const rel = item.openInNewTab ? "noopener noreferrer" : undefined;

  return (
    <Link
      key={`${item.href}-${item.label}`}
      href={item.href}
      target={target}
      rel={rel}
      className={cn(
        "text-sm font-medium text-secondary-700 transition-colors hover:text-primary-600",
        className
      )}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  );
}

export default function Header({
  siteName,
  logo,
  navigation = [],
  secondaryNavigation = [],
  headerCta,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const logoAlt = logo?.alt ?? siteName ?? "Site logo";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              {logo?.url ? (
                <img
                  src={logo.url}
                  alt={logoAlt}
                  className="h-8 w-auto rounded-md object-contain"
                />
              ) : (
                <div className="h-8 w-8 rounded-lg bg-primary-600" />
              )}
              <span className="text-xl font-bold text-secondary-900">
                {siteName ?? "B2B App"}
              </span>
            </Link>

            {navigation.length > 0 && (
              <div className="hidden md:flex md:gap-6">
                {navigation.map((item) => renderNavLink(item))}
              </div>
            )}
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            {secondaryNavigation.map((item) =>
              renderNavLink(item, undefined, "text-secondary-600")
            )}
            {headerCta && headerCta.label && headerCta.href && (
              <Link
                href={headerCta.href}
                target={headerCta.openInNewTab ? "_blank" : undefined}
                rel={headerCta.openInNewTab ? "noopener noreferrer" : undefined}
                className={getCtaClass(headerCta.variant)}
              >
                {headerCta.label}
              </Link>
            )}
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-secondary-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-neutral-200 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => renderNavLink(item, closeMobileMenu))}

              {secondaryNavigation.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4">
                  {secondaryNavigation.map((item) =>
                    renderNavLink(item, closeMobileMenu, "text-secondary-600")
                  )}
                </div>
              )}

              {headerCta && headerCta.label && headerCta.href && (
                <Link
                  href={headerCta.href}
                  target={headerCta.openInNewTab ? "_blank" : undefined}
                  rel={
                    headerCta.openInNewTab ? "noopener noreferrer" : undefined
                  }
                  className={cn(
                    getCtaClass(headerCta.variant),
                    "mt-4 text-center"
                  )}
                  onClick={closeMobileMenu}
                >
                  {headerCta.label}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
