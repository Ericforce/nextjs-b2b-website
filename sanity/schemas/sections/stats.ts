import { defineArrayMember, defineField, defineType } from "sanity";

export const statsSection = defineType({
  name: "statsSection",
  title: "Statistics",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [defineArrayMember({ type: "stat" })],
      validation: (Rule) => Rule.min(2).max(6),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Grid", value: "grid" },
          { title: "Highlight", value: "highlight" },
        ],
        layout: "radio",
      },
      initialValue: "grid",
    }),
    defineField({
      name: "background",
      title: "Background",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Muted", value: "muted" },
          { title: "Primary", value: "primary" },
        ],
      },
      initialValue: "default",
    }),
  ],
  preview: {
    select: {
      title: "headline",
      count: "stats.length",
    },
    prepare({ title, count }) {
      return {
        title,
        subtitle: count ? `${count} stat${count === 1 ? "" : "s"}` : "No stats",
      };
    },
  },
});
