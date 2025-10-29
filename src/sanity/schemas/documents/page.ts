import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { sectionArrayMembers } from "../../schemas/objects/sections";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
    { name: "metadata", title: "Metadata" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "metadata",
      options: {
        source: "title",
        slugify: (value) =>
          value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      group: "content",
      of: sectionArrayMembers,
      validation: (rule) => rule.min(1).error("Add at least one section"),
    }),
    defineField({
      name: "seo",
      title: "SEO overrides",
      type: "seo",
      group: "seo",
    }),
    defineField({
      name: "createdAt",
      title: "Created",
      type: "datetime",
      group: "metadata",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Last updated",
      type: "datetime",
      group: "metadata",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Title A → Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Updated (newest)",
      name: "updatedDesc",
      by: [{ field: "updatedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      description: "description",
    },
    prepare({ title, slug, description }) {
      return {
        title: title ?? "Untitled page",
        subtitle: slug ? `/${slug}` : description,
      };
    },
  },
});
