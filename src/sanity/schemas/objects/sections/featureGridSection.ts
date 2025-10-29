import { DashboardIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const featureGridSection = defineType({
  name: "featureGridSection",
  title: "Feature Grid",
  type: "object",
  icon: DashboardIcon,
  fields: [
    defineField({
      name: "kicker",
      title: "Eyebrow",
      type: "string",
    }),
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
      name: "columns",
      title: "Columns",
      type: "number",
      description: "Controls how many columns render on desktop.",
      initialValue: 3,
      validation: (rule) => rule.min(2).max(4),
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        defineArrayMember({
          name: "feature",
          title: "Feature",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description:
                "Optional icon name from the design system (e.g. chart-bar, shield)",
            }),
            defineField({
              name: "media",
              title: "Media",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt text",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "link",
              title: "Link",
              type: "link",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Feature",
                subtitle: subtitle ? subtitle.slice(0, 80) : undefined,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(3).error("Add at least three features"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      count: "features",
    },
    prepare({ title, count }) {
      const total = Array.isArray(count) ? count.length : 0;
      return {
        title: title ?? "Feature grid",
        subtitle: `${total} feature${total === 1 ? "" : "s"}`,
      };
    },
  },
});
