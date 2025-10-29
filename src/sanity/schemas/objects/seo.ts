import { RocketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: RocketIcon,
  groups: [
    { name: "meta", title: "Metadata" },
    { name: "openGraph", title: "Open Graph" },
    { name: "twitter", title: "Twitter" },
    { name: "advanced", title: "Advanced" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "meta",
      validation: (rule) => rule.max(60).warning("Google typically truncates titles over 60 characters"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "meta",
      validation: (rule) => rule.max(160).warning("Meta descriptions are usually truncated after 160 characters"),
    }),
    defineField({
      name: "titleTemplate",
      title: "Title Template",
      type: "string",
      group: "advanced",
      description:
        "Optional template such as '%s | Company' when this document is the primary page",
    }),
    defineField({
      name: "canonical",
      title: "Canonical URL",
      type: "url",
      group: "advanced",
      validation: (rule) =>
        rule.uri({
          allowRelative: true,
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      group: "advanced",
      initialValue: false,
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      group: "advanced",
    }),
    defineField({
      name: "ogTitle",
      title: "Open Graph Title",
      type: "string",
      group: "openGraph",
    }),
    defineField({
      name: "ogDescription",
      title: "Open Graph Description",
      type: "text",
      rows: 3,
      group: "openGraph",
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "socialImage",
      group: "openGraph",
    }),
    defineField({
      name: "twitterTitle",
      title: "Twitter Title",
      type: "string",
      group: "twitter",
    }),
    defineField({
      name: "twitterDescription",
      title: "Twitter Description",
      type: "text",
      rows: 3,
      group: "twitter",
    }),
    defineField({
      name: "twitterImage",
      title: "Twitter Image",
      type: "socialImage",
      group: "twitter",
    }),
  ],
});
