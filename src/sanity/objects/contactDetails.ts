import { defineField, defineType } from "sanity";

export const contactDetails = defineType({
  name: "contactDetails",
  title: "Contact Details",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Icon name or emoji",
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "url",
      description: "Optional link (e.g., mailto:, tel:, or external URL)",
    }),
  ],
  preview: {
    select: {
      label: "label",
      value: "value",
      icon: "icon",
    },
    prepare({ label, value, icon }) {
      return {
        title: label,
        subtitle: value,
        media: icon || null,
      };
    },
  },
});
