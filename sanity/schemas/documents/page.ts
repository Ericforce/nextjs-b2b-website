import { defineArrayMember, defineField, defineType } from "sanity";

import { defaultSlugify } from "../../utils/slugify";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" },
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
      group: "content",
      options: {
        source: "title",
        slugify: defaultSlugify,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "heroSection",
      group: "content",
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
        defineArrayMember({
          name: "reusableSectionReference",
          title: "Reusable section",
          type: "reference",
          to: [{ type: "reusableSection" }],
        }),
      ],
      validation: (Rule) => Rule.min(1).error("Add at least one section."),
    }),
    defineField({
      name: "seo",
      title: "SEO overrides",
      type: "seo",
      group: "seo",
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      group: "settings",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "settings",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "In review", value: "review" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
    }),
    defineField({
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 3,
      group: "settings",
    }),
  ],
  orderings: [
    {
      name: "titleAsc",
      title: "Title, A→Z",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      name: "publishedAtDesc",
      title: "Publish date, new → old",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      status: "status",
    },
    prepare({ title, slug, status }) {
      const statusLabel = status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : undefined;
      const parts = [slug ? `/${slug}` : undefined, statusLabel].filter(Boolean);

      return {
        title,
        subtitle: parts.length ? parts.join(" • ") : undefined,
      };
    },
  },
});
