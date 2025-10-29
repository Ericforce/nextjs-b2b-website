import { defineArrayMember, defineField, defineType } from "sanity";

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Testimonials",
  type: "object",
  fields: [
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
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Carousel", value: "carousel" },
          { title: "Grid", value: "grid" },
          { title: "Single", value: "single" },
        ],
        layout: "radio",
      },
      initialValue: "grid",
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [defineArrayMember({ type: "testimonial" })],
      validation: (Rule) => Rule.min(1).max(8),
    }),
  ],
  preview: {
    select: {
      title: "headline",
      count: "testimonials.length",
    },
    prepare({ title, count }) {
      return {
        title,
        subtitle: count ? `${count} testimonial${count === 1 ? "" : "s"}` : "No testimonials",
      };
    },
  },
});
