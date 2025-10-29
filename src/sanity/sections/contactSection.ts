import { defineField, defineType } from "sanity";

export const contactSection = defineType({
  name: "contactSection",
  title: "Contact Section",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Small text above the headline",
    }),
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
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      description: "CSS color value",
    }),
    defineField({
      name: "showForm",
      title: "Show Contact Form",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "contactDetails",
      title: "Contact Details",
      type: "array",
      of: [{ type: "contactDetails" }],
    }),
  ],
  preview: {
    select: {
      headline: "headline",
      showForm: "showForm",
    },
    prepare({ headline, showForm }) {
      return {
        title: headline || "Contact",
        subtitle: showForm ? "Form + Details" : "Details Only",
      };
    },
  },
});
