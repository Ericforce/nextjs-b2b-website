import { defineField, defineType } from "sanity";

export const statsSection = defineType({
  name: "statsSection",
  title: "Stats Section",
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
      title: "Statistics",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
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
              value: "value",
              label: "label",
              icon: "icon",
            },
            prepare({ value, label, icon }) {
              return {
                title: `${value} ${label}`,
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
    },
    prepare({ headline }) {
      return {
        title: headline || "Statistics",
        subtitle: "Stats Section",
      };
    },
  },
});
