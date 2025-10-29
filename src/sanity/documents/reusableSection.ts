import { defineField, defineType } from "sanity";

export const reusableSection = defineType({
  name: "reusableSection",
  title: "Reusable Section",
  type: "document",
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
      rows: 2,
      description: "Internal description for content editors",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        { type: "heroSection" },
        { type: "featureGridSection" },
        { type: "testimonialSection" },
        { type: "ctaSection" },
        { type: "richTextSection" },
        { type: "faqSection" },
        { type: "statsSection" },
        { type: "logoCloudSection" },
        { type: "contactSection" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
    },
    prepare({ title, description }) {
      return {
        title,
        subtitle: description || "Reusable Section",
      };
    },
  },
});
