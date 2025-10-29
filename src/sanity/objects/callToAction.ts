import { defineField, defineType } from "sanity";

export const callToAction = defineType({
  name: "callToAction",
  title: "Call to Action",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Button Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      description: "External URL or leave empty to link to internal page",
    }),
    defineField({
      name: "reference",
      title: "Internal Page",
      type: "reference",
      to: [{ type: "page" }],
      description: "Select a page to link to",
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Ghost", value: "ghost" },
          { title: "Link", value: "link" },
        ],
      },
      initialValue: "primary",
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in New Tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      text: "text",
      href: "href",
      page: "reference.title",
      variant: "variant",
    },
    prepare({ text, href, page, variant }) {
      const destination = href || page || "No destination";
      return {
        title: text,
        subtitle: `${variant} • ${destination}`,
      };
    },
  },
});
