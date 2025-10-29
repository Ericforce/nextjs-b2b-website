import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "profile", title: "Profile" },
    { name: "bio", title: "Bio" },
    { name: "social", title: "Social" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "profile",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "profile",
      options: {
        source: "name",
        slugify: (value) =>
          value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      group: "profile",
      description: "The author's role or title that appears on blog posts.",
    }),
    defineField({
      name: "headshot",
      title: "Headshot",
      type: "image",
      group: "profile",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "blockContent",
      group: "bio",
    }),
    defineField({
      name: "social",
      title: "Social profiles",
      type: "array",
      group: "social",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "social",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      group: "social",
      validation: (rule) =>
        rule.uri({ allowRelative: false, scheme: ["http", "https"] }),
    }),
  ],
  orderings: [
    {
      title: "Name A → Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "headshot",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "Author",
        subtitle,
        media,
      };
    },
  },
});
