import { defineField, defineType } from "sanity";

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ Section",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Single Column", value: "single-column" },
          { title: "Two Column", value: "two-column" },
        ],
      },
      initialValue: "single-column",
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        {
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
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  lists: [
                    { title: "Bullet", value: "bullet" },
                    { title: "Number", value: "number" },
                  ],
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
                      { title: "Emphasis", value: "em" },
                      { title: "Code", value: "code" },
                      { title: "Underline", value: "underline" },
                      { title: "Strike", value: "strike-through" },
                    ],
                    annotations: [
                      { type: "linkInternal" },
                      { type: "linkExternal" },
                    ],
                  },
                },
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              question: "question",
            },
            prepare({ question }) {
              return {
                title: question || "Untitled Question",
                subtitle: "FAQ",
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
      layout: "layout",
    },
    prepare({ headline, layout }) {
      return {
        title: headline || "FAQ",
        subtitle: layout ? `Layout: ${layout}` : "FAQ Section",
      };
    },
  },
});
