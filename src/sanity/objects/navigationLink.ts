import { defineField, defineType } from "sanity";

export const navigationLink = defineType({
  name: "navigationLink",
  title: "Navigation Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
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
      name: "openInNewTab",
      title: "Open in New Tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      label: "label",
      href: "href",
      page: "reference.title",
    },
    prepare({ label, href, page }) {
      const destination = href || page || "No destination";
      return {
        title: label,
        subtitle: destination,
      };
    },
  },
});
