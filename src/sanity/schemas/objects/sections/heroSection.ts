import { SparkleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  icon: SparkleIcon,
  fields: [
    defineField({
      name: "variant",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Split", value: "split" },
          { title: "Centered", value: "centered" },
          { title: "Simple", value: "simple" },
        ],
        layout: "radio",
      },
      initialValue: "split",
    }),
    defineField({
      name: "kicker",
      title: "Eyebrow",
      type: "string",
      description: "Short label displayed above the heading.",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Supporting copy",
      type: "blockContent",
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "link",
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "link",
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
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "badges",
      title: "Badges",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "badge",
          title: "Badge",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "label",
            },
            prepare({ title }) {
              return {
                title: title ?? "Badge",
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "kicker",
      media: "media",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "Hero section",
        subtitle: subtitle ? `Hero • ${subtitle}` : "Hero section",
        media,
      };
    },
  },
});
