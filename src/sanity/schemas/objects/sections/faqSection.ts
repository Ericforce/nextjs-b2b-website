import { HelpCircleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ Accordion",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "faqs",
      title: "FAQ items",
      type: "array",
      of: [
        defineArrayMember({
          name: "faq",
          title: "FAQ",
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "blockContent",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "question",
            },
            prepare({ title }) {
              return {
                title: title ?? "FAQ",
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).error("Add at least one FAQ"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      faqs: "faqs",
    },
    prepare({ title, faqs }) {
      const total = Array.isArray(faqs) ? faqs.length : 0;
      return {
        title: title ?? "FAQs",
        subtitle: `${total} question${total === 1 ? "" : "s"}`,
      };
    },
  },
});
