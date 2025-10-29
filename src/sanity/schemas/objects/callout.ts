import { BulbOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      initialValue: "info",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Success", value: "success" },
          { title: "Warning", value: "warning" },
          { title: "Danger", value: "danger" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      tone: "tone",
    },
    prepare({ title, tone }) {
      return {
        title: title ?? "Callout",
        subtitle: tone ? tone.charAt(0).toUpperCase() + tone.slice(1) : "Info",
      };
    },
  },
});
