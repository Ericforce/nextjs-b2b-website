import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
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
      rows: 3,
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "color",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Icon name or emoji",
    }),
  ],
  preview: {
    select: {
      title: "title",
      color: "color",
      icon: "icon",
    },
    prepare({ title, color, icon }) {
      return {
        title,
        subtitle: icon ? `${icon} • Category` : "Category",
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
