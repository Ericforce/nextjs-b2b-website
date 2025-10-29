import { defineField, defineType } from "sanity";

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call to Action Section",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
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
      initialValue: "center",
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "secondaryCTA",
      title: "Secondary CTA",
      type: "callToAction",
    }),
  ],
  preview: {
    select: {
      headline: "headline",
      alignment: "alignment",
    },
    prepare({ headline, alignment }) {
      return {
        title: headline || "Call to Action",
        subtitle: alignment ? `Alignment: ${alignment}` : "CTA Section",
      };
    },
  },
});
