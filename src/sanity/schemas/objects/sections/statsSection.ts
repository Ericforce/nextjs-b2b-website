import { TrendUpIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const statsSection = defineType({
  name: "statsSection",
  title: "Stats",
  type: "object",
  icon: TrendUpIcon,
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
      name: "stats",
      title: "Metrics",
      type: "array",
      of: [
        defineArrayMember({
          name: "stat",
          title: "Stat",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: "Display value such as 120% or 24M.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
            defineField({
              name: "trend",
              title: "Trend",
              type: "string",
              description: "Optional context like 'vs last quarter'.",
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "value",
              subtitle: "label",
            },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Stat",
                subtitle,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(3).error("Add at least three metrics"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      stats: "stats",
    },
    prepare({ title, stats }) {
      const total = Array.isArray(stats) ? stats.length : 0;
      return {
        title: title ?? "Stats",
        subtitle: `${total} metric${total === 1 ? "" : "s"}`,
      };
    },
  },
});
