import { defineField, defineType } from "sanity";

export const featureGridSection = defineType({
  name: "featureGridSection",
  title: "Feature Grid Section",
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
      name: "columns",
      title: "Columns",
      type: "number",
      options: {
        list: [
          { title: "1", value: 1 },
          { title: "2", value: 2 },
          { title: "3", value: 3 },
          { title: "4", value: 4 },
        ],
      },
      initialValue: 3,
      validation: (Rule) => Rule.required().min(1).max(4),
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
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
              name: "icon",
              title: "Icon",
              type: "string",
              description: "Icon name or emoji",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "imageWithHotspot",
            }),
          ],
          preview: {
            select: {
              title: "title",
              icon: "icon",
            },
            prepare({ title, icon }) {
              return {
                title: title || "Untitled Feature",
                subtitle: icon || "No icon",
                media: icon || null,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      headline: "headline",
      columns: "columns",
    },
    prepare({ headline, columns }) {
      return {
        title: headline || "Feature Grid",
        subtitle: columns ? `${columns} columns` : "Feature Grid",
      };
    },
  },
});
