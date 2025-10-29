import { SpeechBubbleIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Testimonials",
  type: "object",
  icon: SpeechBubbleIcon,
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
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Carousel", value: "carousel" },
          { title: "Grid", value: "grid" },
          { title: "Single Highlight", value: "single" },
        ],
        layout: "radio",
      },
      initialValue: "grid",
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        defineArrayMember({
          name: "testimonial",
          title: "Testimonial",
          type: "object",
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "authorName",
              title: "Author name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "authorTitle",
              title: "Author title",
              type: "string",
            }),
            defineField({
              name: "company",
              title: "Company",
              type: "string",
            }),
            defineField({
              name: "avatar",
              title: "Avatar",
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
              name: "logo",
              title: "Company logo",
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
          ],
          preview: {
            select: {
              title: "authorName",
              subtitle: "authorTitle",
              media: "avatar",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title ?? "Testimonial",
                subtitle,
                media,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).error("Add at least one testimonial"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      testimonials: "testimonials",
    },
    prepare({ title, testimonials }) {
      const total = Array.isArray(testimonials) ? testimonials.length : 0;
      return {
        title: title ?? "Testimonials",
        subtitle: `${total} testimonial${total === 1 ? "" : "s"}`,
      };
    },
  },
});
