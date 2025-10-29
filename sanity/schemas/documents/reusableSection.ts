import { defineArrayMember, defineField, defineType } from "sanity";

import { defaultSlugify } from "../../utils/slugify";

export const reusableSection = defineType({
  name: "reusableSection",
  title: "Reusable section",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "metadata", title: "Metadata" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "metadata",
      options: {
        source: "title",
        slugify: defaultSlugify,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "metadata",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "featureGridSection" }),
        defineArrayMember({ type: "ctaSection" }),
        defineArrayMember({ type: "testimonialsSection" }),
        defineArrayMember({ type: "richTextSection" }),
        defineArrayMember({ type: "logoCloudSection" }),
        defineArrayMember({ type: "faqSection" }),
        defineArrayMember({ type: "statsSection" }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      count: "sections.length",
    },
    prepare({ title, count }) {
      return {
        title,
        subtitle: count ? `${count} section${count === 1 ? "" : "s"}` : "No sections",
      };
    },
  },
});
