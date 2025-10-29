import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich Text",
  type: "object",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Narrow", value: "narrow" },
          { title: "Default", value: "default" },
          { title: "Wide", value: "wide" },
          { title: "Two Column", value: "twoColumn" },
        ],
      },
      initialValue: "default",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title ?? "Rich text",
        subtitle: "Rich text content",
      };
    },
  },
});
