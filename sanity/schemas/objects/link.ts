import { defineField, defineType } from "sanity";

type LinkContext = {
  parent?: {
    href?: string;
  };
};

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Text displayed for this link.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      description: "External URL or relative path (e.g. /pricing).",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: true,
          relativeOnly: false,
          scheme: ["http", "https", "mailto", "tel"],
        }).warning("Enter a valid URL or relative path."),
    }),
    defineField({
      name: "reference",
      title: "Internal link",
      type: "reference",
      to: [
        { type: "page" },
        { type: "blogPost" },
        { type: "category" },
        { type: "tag" },
        { type: "reusableSection" },
      ],
      description: "Reference existing content instead of entering a URL.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const { parent } = context as LinkContext;
          const hasUrl = Boolean(parent?.href);

          if (!value && !hasUrl) {
            return "Provide either a URL or choose an internal reference.";
          }

          if (value && hasUrl) {
            return "Use either a URL or an internal reference, not both.";
          }

          return true;
        }),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
      description: "Enable to open this link in a new browser tab.",
    }),
  ],
  preview: {
    select: {
      title: "label",
      href: "href",
      referenceTitle: "reference->title",
      referenceSlug: "reference->slug.current",
    },
    prepare({ title, href, referenceTitle, referenceSlug }) {
      const subtitle = href
        ? href
        : referenceTitle
          ? `${referenceTitle}${referenceSlug ? ` (/${referenceSlug})` : ""}`
          : "Untitled link";

      return {
        title,
        subtitle,
      };
    },
  },
});
