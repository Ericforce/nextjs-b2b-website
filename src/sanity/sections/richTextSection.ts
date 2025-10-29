import { defineField, defineType } from "sanity";

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich Text Section",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      description: "CSS color value",
    }),
    defineField({
      name: "width",
      title: "Width",
      type: "string",
      options: {
        list: [
          { title: "Narrow", value: "narrow" },
          { title: "Medium", value: "medium" },
          { title: "Full", value: "full" },
        ],
      },
      initialValue: "medium",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "portableText",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
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
            annotations: [{ type: "linkInternal" }, { type: "linkExternal" }],
          },
        },
        { type: "image" },
        { type: "codeBlock" },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      headline: "headline",
      width: "width",
    },
    prepare({ headline, width }) {
      return {
        title: headline || "Rich Text",
        subtitle: width ? `Width: ${width}` : "Rich Text Section",
      };
    },
  },
});
