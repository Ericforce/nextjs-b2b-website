import Link from "next/link";

import { cn } from "@/lib/utils";
import type { ContactSection as ContactSectionType } from "@/types";

import ContactForm from "@/components/forms/ContactForm";

import { resolveSectionBackground } from "./utils";

export function ContactSection(section: ContactSectionType) {
  const {
    anchor,
    eyebrow,
    headline,
    description,
    backgroundColor,
    showForm = true,
    contactDetails,
  } = section;

  const palette = resolveSectionBackground(backgroundColor);

  return (
    <section
      id={anchor || undefined}
      className={cn(palette.container, "py-16 sm:py-20 lg:py-24")}
    >
      <div className="container-custom">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-6">
            {eyebrow ? (
              <p className={cn("text-sm font-semibold uppercase tracking-[0.35em]", palette.eyebrow)}>
                {eyebrow}
              </p>
            ) : null}

            {headline ? (
              <h2 className={cn("text-3xl font-semibold sm:text-4xl", palette.heading)}>
                {headline}
              </h2>
            ) : null}

            {description ? (
              <p className={cn("text-lg", palette.body)}>{description}</p>
            ) : null}

            {contactDetails && contactDetails.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {contactDetails.map((detail, index) => {
                  const key = detail._key ?? `${detail.label ?? "detail"}-${index}`;
                  const content = (
                    <div className="flex flex-col">
                      {detail.label ? (
                        <span
                          className={cn(
                            "text-sm font-medium uppercase tracking-wide",
                            palette.isDark ? "text-secondary-200" : "text-secondary-500"
                          )}
                        >
                          {detail.label}
                        </span>
                      ) : null}
                      {detail.value ? (
                        <span
                          className={cn(
                            "text-lg",
                            palette.isDark ? "text-white" : "text-secondary-900"
                          )}
                        >
                          {detail.value}
                        </span>
                      ) : null}
                    </div>
                  );

                  return (
                    <li
                      key={key}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border p-4",
                        palette.isDark
                          ? "border-white/10 bg-secondary-900/40"
                          : "border-neutral-200 bg-white"
                      )}
                    >
                      {detail.icon ? (
                        <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-lg text-primary-700">
                          {detail.icon}
                        </span>
                      ) : null}
                      {detail.href ? (
                        <Link
                          href={detail.href}
                          className="flex-1"
                          target={detail.href.startsWith("http") ? "_blank" : undefined}
                          rel={detail.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                          {content}
                        </Link>
                      ) : (
                        <div className="flex-1">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {showForm ? (
            <div className="rounded-3xl bg-white p-6 shadow-soft sm:p-8 lg:p-10">
              <h3 className="text-2xl font-semibold text-secondary-900">
                Send us a message
              </h3>
              <p className="mt-2 text-base text-secondary-600">
                Fill out the form and our team will get back to you within one
                business day.
              </p>
              <ContactForm className="mt-6" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
