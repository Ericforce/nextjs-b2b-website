import { defineField, defineType } from "sanity";

export const socialLinks = defineType({
  name: "socialLinks",
  title: "Social links",
  type: "object",
  fields: [
    defineField({
      name: "twitter",
      title: "Twitter",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"], allowRelative: false }).warning(
          "Provide a valid URL or leave blank.",
        ),
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"], allowRelative: false }).warning(
          "Provide a valid URL or leave blank.",
        ),
    }),
    defineField({
      name: "github",
      title: "GitHub",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"], allowRelative: false }).warning(
          "Provide a valid URL or leave blank.",
        ),
    }),
    defineField({
      name: "youtube",
      title: "YouTube",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"], allowRelative: false }).warning(
          "Provide a valid URL or leave blank.",
        ),
    }),
    defineField({
      name: "facebook",
      title: "Facebook",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"], allowRelative: false }).warning(
          "Provide a valid URL or leave blank.",
        ),
    }),
  ],
});
