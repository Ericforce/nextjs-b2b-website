import { defineField, defineType } from "sanity";

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call to action",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(360),
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "cta",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "cta",
    }),
    defineField({
      name: "alignment",
      title: "Content alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "center",
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
  ],
  preview: {
    select: {
      title: "headline",
      subtitle: "background",
    },
  },
});
