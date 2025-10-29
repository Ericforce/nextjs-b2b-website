import { MegaphoneIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const ctaSection = defineType({
  name: "ctaSection",
  title: "CTA Band",
  type: "object",
  icon: MegaphoneIcon,
  fields: [
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Neutral", value: "neutral" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "link",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "link",
    }),
    defineField({
      name: "media",
      title: "Background media",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      tone: "tone",
    },
    prepare({ title, tone }) {
      return {
        title: title ?? "CTA band",
        subtitle: tone ? `Tone: ${tone}` : undefined,
      };
    },
  },
});
