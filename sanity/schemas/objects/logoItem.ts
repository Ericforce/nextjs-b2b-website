import { defineField, defineType } from "sanity";

export const logoItem = defineType({
  name: "logoItem",
  title: "Logo",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Logo",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "link",
      description: "Optional link associated with this logo.",
    }),
  ],
  preview: {
    select: {
      media: "image",
      title: "image.alt",
    },
    prepare({ media, title }) {
      return {
        media,
        title: title || "Logo",
      };
    },
  },
});
