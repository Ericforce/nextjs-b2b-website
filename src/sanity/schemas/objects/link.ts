import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const linkStyles = [
  { title: "Default", value: "default" },
  { title: "Primary", value: "primary" },
  { title: "Secondary", value: "secondary" },
  { title: "Ghost", value: "ghost" },
  { title: "Link", value: "link" },
] as const;

const linkIcons = [
  { title: "None", value: "none" },
  { title: "Arrow Right", value: "arrowRight" },
  { title: "Arrow Down", value: "arrowDown" },
  { title: "External", value: "external" },
  { title: "Download", value: "download" },
] as const;

export const link = defineType({
  name: "link",
  title: "Link / CTA",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "linkType",
      title: "Link Type",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Internal", value: "internal" },
          { title: "External", value: "external" },
        ],
      },
      initialValue: "internal",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reference",
      title: "Internal Reference",
      type: "reference",
      to: [
        { type: "page" },
        { type: "blogPost" },
        { type: "category" },
        { type: "tag" },
        { type: "reusableSection" },
      ],
      options: {
        disableNew: true,
      },
      hidden: ({ parent }) => parent?.linkType !== "internal",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (context.parent?.linkType === "internal" && !value) {
            return "Select an internal reference";
          }

          return true;
        }),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      hidden: ({ parent }) => parent?.linkType !== "external",
      validation: (rule) =>
        rule.uri({
          allowRelative: true,
          scheme: ["http", "https", "mailto", "tel"],
        }),
    }),
    defineField({
      name: "style",
      title: "Presentation",
      type: "string",
      options: {
        list: linkStyles,
        layout: "dropdown",
      },
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: linkIcons,
        layout: "dropdown",
      },
    }),
  ],
  preview: {
    select: {
      title: "label",
      linkType: "linkType",
      url: "url",
      refTitle: "reference.title",
      refSlug: "reference.slug.current",
      style: "style",
    },
    prepare({ title, linkType, url, refTitle, refSlug, style }) {
      const destination =
        linkType === "internal"
          ? refTitle ?? (refSlug ? `/${refSlug}` : "Unlinked")
          : url ?? "No URL";

      const subtitleParts = [
        linkType === "internal" ? "Internal" : "External",
        style ? `• ${style}` : undefined,
        destination,
      ].filter(Boolean);

      return {
        title: title ?? "Untitled link",
        subtitle: subtitleParts.join(" "),
      };
    },
  },
});
