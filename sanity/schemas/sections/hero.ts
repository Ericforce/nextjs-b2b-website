import { defineField, defineType } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Optional label displayed above the headline.",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required().min(4).max(120),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(320),
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
      name: "backgroundImage",
      title: "Background image",
      type: "imageWithAlt",
      description: "Optional image displayed alongside the hero content.",
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
      initialValue: "left",
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "string",
      description: "Controls background and text treatment for the hero.",
      options: {
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
          { title: "Accent", value: "accent" },
        ],
        layout: "radio",
      },
      initialValue: "light",
    }),
  ],
  preview: {
    select: {
      title: "headline",
      subtitle: "subheadline",
      media: "backgroundImage",
    },
  },
});
