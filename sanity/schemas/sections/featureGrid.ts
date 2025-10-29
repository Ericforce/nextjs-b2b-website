import { defineArrayMember, defineField, defineType } from "sanity";

export const featureGridSection = defineType({
  name: "featureGridSection",
  title: "Feature grid",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [defineArrayMember({ type: "feature" })],
      validation: (Rule) => Rule.min(2).max(8),
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      options: {
        list: [
          { title: "Two", value: 2 },
          { title: "Three", value: 3 },
          { title: "Four", value: 4 },
        ],
        layout: "radio",
      },
      initialValue: 3,
      validation: (Rule) => Rule.required(),
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
        layout: "dropdown",
      },
      initialValue: "default",
    }),
  ],
  preview: {
    select: {
      title: "headline",
      count: "features.length",
    },
    prepare({ title, count }) {
      return {
        title,
        subtitle: count ? `${count} feature${count === 1 ? "" : "s"}` : "No features",
      };
    },
  },
});
