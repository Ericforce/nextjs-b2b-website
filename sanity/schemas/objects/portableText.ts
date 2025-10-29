import { defineArrayMember, defineField, defineType } from "sanity";

export const portableText = defineType({
  name: "portableText",
  title: "Portable text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      marks: {
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (Rule) =>
                  Rule.required().uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              }),
              defineField({
                name: "openInNewTab",
                title: "Open in new tab",
                type: "boolean",
                initialValue: false,
              }),
            ],
          },
        ],
      },
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
    }),
    defineArrayMember({
      type: "imageWithAlt",
    }),
    defineArrayMember({
      type: "cta",
      name: "inlineCta",
      title: "Inline CTA",
    }),
    defineArrayMember({
      type: "code",
      title: "Code block",
      options: {
        withFilename: true,
      },
    }),
  ],
});
