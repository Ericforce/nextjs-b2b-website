import { LayersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { reusableSectionMembers } from "../../schemas/objects/sections";

export const reusableSection = defineType({
  name: "reusableSection",
  title: "Reusable Section",
  type: "document",
  icon: LayersIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Explain where this section should be used.",
    }),
    defineField({
      name: "section",
      title: "Section",
      type: "array",
      of: reusableSectionMembers,
      validation: (rule) =>
        rule
          .min(1)
          .max(1)
          .error("Add exactly one section configuration"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      section: "section",
    },
    prepare({ title, section }) {
      const firstItem = Array.isArray(section) ? section[0] : undefined;
      const subtitle = firstItem?._type
        ? `Reusable • ${firstItem._type}`
        : "Reusable section";
      return {
        title: title ?? "Reusable section",
        subtitle,
      };
    },
  },
});
