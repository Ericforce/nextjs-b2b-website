import { defineArrayMember, defineField, defineType } from "sanity";

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQs",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Single column", value: "single" },
          { title: "Two column", value: "twoColumn" },
        ],
        layout: "radio",
      },
      initialValue: "single",
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [defineArrayMember({ type: "faqItem" })],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "headline",
      count: "faqs.length",
    },
    prepare({ title, count }) {
      return {
        title,
        subtitle: count ? `${count} FAQ${count === 1 ? "" : "s"}` : "No FAQs",
      };
    },
  },
});
