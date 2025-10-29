import { defineField, defineType } from "sanity";

export const socialLinks = defineType({
  name: "socialLinks",
  title: "Social Links",
  type: "object",
  fields: [
    defineField({
      name: "twitter",
      title: "Twitter",
      type: "url",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn",
      type: "url",
    }),
    defineField({
      name: "github",
      title: "GitHub",
      type: "url",
    }),
    defineField({
      name: "youtube",
      title: "YouTube",
      type: "url",
    }),
    defineField({
      name: "facebook",
      title: "Facebook",
      type: "url",
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Social Links",
    }),
  },
});
