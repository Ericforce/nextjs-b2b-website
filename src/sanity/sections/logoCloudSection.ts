import { defineField, defineType } from "sanity";

export const logoCloudSection = defineType({
  name: "logoCloudSection",
  title: "Logo Cloud Section",
  type: "object",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "grayscale",
      title: "Grayscale",
      type: "boolean",
      initialValue: true,
      description: "Display logos in grayscale",
    }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Logo",
              type: "imageWithHotspot",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "url",
              description: "Optional link when logo is clicked",
            }),
          ],
          preview: {
            select: {
              media: "image.asset",
              href: "href",
            },
            prepare({ media, href }) {
              return {
                title: href || "No link",
                subtitle: "Logo",
                media,
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
      grayscale: "grayscale",
    },
    prepare({ headline, grayscale }) {
      return {
        title: headline || "Logo Cloud",
        subtitle: grayscale ? "Grayscale" : "Color",
      };
    },
  },
});
