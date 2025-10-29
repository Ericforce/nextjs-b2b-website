import { defineField, defineType } from "sanity";

export const linkExternal = defineType({
  name: "linkExternal",
  title: "External Link",
  type: "object",
  fields: [
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in New Tab",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      href: "href",
    },
    prepare({ href }) {
      return {
        title: `External: ${href}`,
      };
    },
  },
});
