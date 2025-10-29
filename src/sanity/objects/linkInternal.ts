import { defineField, defineType } from "sanity";

export const linkInternal = defineType({
  name: "linkInternal",
  title: "Internal Link",
  type: "object",
  fields: [
    defineField({
      name: "reference",
      title: "Reference",
      type: "reference",
      to: [{ type: "page" }, { type: "blogPost" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "reference.title",
      type: "reference._type",
    },
    prepare({ title, type }) {
      return {
        title: `Internal: ${title || "Untitled"}`,
        subtitle: type,
      };
    },
  },
});
