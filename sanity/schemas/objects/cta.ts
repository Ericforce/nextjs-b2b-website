import { defineField, defineType } from "sanity";

export const cta = defineType({
  name: "cta",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "link",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      description: "Controls the visual treatment of the button in the UI.",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Ghost", value: "ghost" },
          { title: "Link", value: "link" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Optional icon identifier these CTAs can leverage (e.g. arrow-right).",
    }),
  ],
  preview: {
    select: {
      title: "label",
      variant: "variant",
    },
    prepare({ title, variant }) {
      return {
        title,
        subtitle: variant ? `${variant} CTA` : "CTA",
      };
    },
  },
});
