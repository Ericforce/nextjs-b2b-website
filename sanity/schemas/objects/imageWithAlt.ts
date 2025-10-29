import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Important for accessibility and SEO.",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional caption displayed with the image.",
      options: {
        isHighlighted: true,
      },
      validation: (Rule) => Rule.max(200),
    }),
  ],
});
