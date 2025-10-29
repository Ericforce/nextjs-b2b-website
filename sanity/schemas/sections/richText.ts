import { defineField, defineType } from "sanity";

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich text",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "portableText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "background",
      title: "Background",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Muted", value: "muted" },
          { title: "Primary", value: "primary" },
          { title: "Dark", value: "dark" },
        ],
      },
      initialValue: "default",
    }),
    defineField({
      name: "width",
      title: "Content width",
      type: "string",
      options: {
        list: [
          { title: "Narrow", value: "narrow" },
          { title: "Default", value: "default" },
          { title: "Full", value: "full" },
        ],
        layout: "radio",
      },
      initialValue: "default",
    }),
  ],
  preview: {
    select: {
      title: "headline",
    },
    prepare({ title }) {
      return {
        title: title || "Rich text section",
      };
    },
  },
});
