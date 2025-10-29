import { defineArrayMember, defineField, defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Rich Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          defineType({
            name: "internalLink",
            title: "Internal link",
            type: "object",
            fields: [
              defineField({
                name: "reference",
                title: "Reference",
                type: "reference",
                to: [
                  { type: "page" },
                  { type: "blogPost" },
                  { type: "category" },
                  { type: "tag" },
                  { type: "reusableSection" },
                ],
                options: {
                  disableNew: true,
                },
                validation: (rule) => rule.required(),
              }),
            ],
          }),
          defineType({
            name: "externalLink",
            title: "External link",
            type: "object",
            fields: [
              defineField({
                name: "url",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.uri({
                    allowRelative: false,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              }),
              defineField({
                name: "openInNewTab",
                title: "Open in new tab",
                type: "boolean",
                initialValue: true,
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required().warning("Add descriptive alt text for accessibility"),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
    defineArrayMember({ type: "callout" }),
  ],
});
