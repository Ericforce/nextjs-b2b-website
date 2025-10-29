import { defineField, defineType } from "sanity";

export const feature = defineType({
  name: "feature",
  title: "Feature",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon token",
      type: "string",
      description: "Reference icon name from the design system (e.g., chart-bar).",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      description: "Optional image that represents this feature.",
    }),
    defineField({
      name: "cta",
      title: "Call to action",
      type: "cta",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? subtitle.slice(0, 80) : undefined,
      };
    },
  },
});
