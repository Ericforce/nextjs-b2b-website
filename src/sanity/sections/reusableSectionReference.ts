import { defineField, defineType } from "sanity";

export const reusableSectionReference = defineType({
  name: "reusableSectionReference",
  title: "Reusable Section Reference",
  type: "object",
  fields: [
    defineField({
      name: "reference",
      title: "Section",
      type: "reference",
      to: [{ type: "reusableSection" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "reference.title",
      description: "reference.description",
    },
    prepare({ title, description }) {
      return {
        title: `Reusable: ${title || "Untitled"}`,
        subtitle: description || "No description",
      };
    },
  },
});
