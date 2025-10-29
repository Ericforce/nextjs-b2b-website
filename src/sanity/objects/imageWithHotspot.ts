import { defineField, defineType } from "sanity";

export const imageWithHotspot = defineType({
  name: "imageWithHotspot",
  title: "Image with Hotspot",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: "alt",
      media: "asset",
    },
    prepare({ title, media }) {
      return {
        title: title || "Untitled image",
        media,
      };
    },
  },
});
