import { ListBulletIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const navigationGroup = defineType({
  name: "navigationGroup",
  title: "Navigation Group",
  type: "object",
  icon: ListBulletIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "Optional heading used for grouped navigation areas like the footer.",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.min(1).error("Add at least one link"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      items: "links",
    },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: title || "Navigation group",
        subtitle: `${count} link${count === 1 ? "" : "s"}`,
      };
    },
  },
});
