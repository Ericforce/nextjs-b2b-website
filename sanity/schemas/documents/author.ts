import { defineField, defineType } from "sanity";

import { defaultSlugify } from "../../utils/slugify";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        slugify: defaultSlugify,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Job title or area of expertise.",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "portableText",
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "headshot",
      title: "Headshot",
      type: "imageWithAlt",
    }),
    defineField({
      name: "social",
      title: "Social profiles",
      type: "socialLinks",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "headshot",
    },
  },
});
