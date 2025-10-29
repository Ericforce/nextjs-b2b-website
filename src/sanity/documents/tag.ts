import { defineField, defineType } from "sanity";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "color",
    }),
  ],
  preview: {
    select: {
      title: "title",
      color: "color",
    },
    prepare({ title, color }) {
      return {
        title,
        subtitle: "Tag",
        media: color
          ? {
              _type: "image",
              asset: {
                _ref: "color-preview",
              },
            }
          : null,
      };
    },
  },
});
