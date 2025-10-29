import { defineField, defineType } from "sanity";

export const stat = defineType({
  name: "stat",
  title: "Statistic",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Optional supporting copy for the statistic.",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Optional icon token from the design system.",
    }),
  ],
  preview: {
    select: {
      title: "value",
      subtitle: "label",
    },
  },
});
