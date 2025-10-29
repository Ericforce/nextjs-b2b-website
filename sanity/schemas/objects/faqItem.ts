import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "portableText",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "question",
    },
  },
});
