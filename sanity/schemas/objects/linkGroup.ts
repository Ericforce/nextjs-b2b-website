import { defineArrayMember, defineField, defineType } from "sanity";

export const linkGroup = defineType({
  name: "linkGroup",
  title: "Link group",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Group title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (Rule) => Rule.min(1).error("Add at least one link."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      count: "links.length",
    },
    prepare({ title, count }) {
      return {
        title,
        subtitle: count ? `${count} link${count === 1 ? "" : "s"}` : "No links",
      };
    },
  },
});
