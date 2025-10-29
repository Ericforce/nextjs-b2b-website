import { defineArrayMember, defineField, defineType } from "sanity";

export const logoCloudSection = defineType({
  name: "logoCloudSection",
  title: "Logo cloud",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [defineArrayMember({ type: "logoItem" })],
      validation: (Rule) => Rule.min(3).max(12),
    }),
    defineField({
      name: "grayscale",
      title: "Render in grayscale",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "headline",
      count: "logos.length",
    },
    prepare({ title, count }) {
      return {
        title: title || "Logo cloud",
        subtitle: count ? `${count} logo${count === 1 ? "" : "s"}` : "No logos",
      };
    },
  },
});
