import { defineField, defineType } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Small text above the headline",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short memorable phrase",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "alignment",
      title: "Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
      },
      initialValue: "left",
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      description: "CSS color value",
    }),
    defineField({
      name: "primaryCTA",
      title: "Primary CTA",
      type: "callToAction",
    }),
    defineField({
      name: "secondaryCTA",
      title: "Secondary CTA",
      type: "callToAction",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "imageWithHotspot",
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "object",
      fields: [
        defineField({
          name: "image",
          title: "Image",
          type: "imageWithHotspot",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      headline: "headline",
      alignment: "alignment",
    },
    prepare({ headline, alignment }) {
      return {
        title: headline || "Hero Section",
        subtitle: alignment ? `Alignment: ${alignment}` : "Hero Section",
      };
    },
  },
});
