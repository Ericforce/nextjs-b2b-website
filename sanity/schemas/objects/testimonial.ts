import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorTitle",
      title: "Author title",
      type: "string",
      description: "Role or title of the person providing the testimonial.",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Headshot",
      type: "imageWithAlt",
      description: "Optional headshot of the testimonial author.",
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      description: "Optional rating out of 5 stars.",
      validation: (Rule) => Rule.min(1).max(5),
    }),
  ],
  preview: {
    select: {
      title: "authorName",
      subtitle: "company",
      media: "image",
    },
  },
});
