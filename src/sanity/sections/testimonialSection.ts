import { defineField, defineType } from "sanity";

export const testimonialSection = defineType({
  name: "testimonialSection",
  title: "Testimonial Section",
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
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Carousel", value: "carousel" },
          { title: "Grid", value: "grid" },
          { title: "Single", value: "single" },
        ],
      },
      initialValue: "carousel",
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        {
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
              name: "author",
              title: "Author",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
            }),
            defineField({
              name: "company",
              title: "Company",
              type: "string",
            }),
            defineField({
              name: "rating",
              title: "Rating",
              type: "number",
              options: {
                list: [
                  { title: "1", value: 1 },
                  { title: "2", value: 2 },
                  { title: "3", value: 3 },
                  { title: "4", value: 4 },
                  { title: "5", value: 5 },
                ],
              },
              validation: (Rule) => Rule.min(1).max(5),
            }),
            defineField({
              name: "image",
              title: "Author Image",
              type: "imageWithHotspot",
            }),
            defineField({
              name: "logo",
              title: "Company Logo",
              type: "imageWithHotspot",
            }),
          ],
          preview: {
            select: {
              quote: "quote",
              author: "author",
              company: "company",
              rating: "rating",
            },
            prepare({ quote, author, company, rating }) {
              return {
                title: author || "Anonymous",
                subtitle: company
                  ? `${company} • ${rating || 0}/5`
                  : `${rating || 0}/5`,
                description: quote ? quote.substring(0, 100) + "..." : "",
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      headline: "headline",
      layout: "layout",
    },
    prepare({ headline, layout }) {
      return {
        title: headline || "Testimonials",
        subtitle: layout ? `Layout: ${layout}` : "Testimonial Section",
      };
    },
  },
});
