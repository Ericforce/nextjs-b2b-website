import { defineField, defineType } from "sanity";

export const codeBlock = defineType({
  name: "codeBlock",
  title: "Code Block",
  type: "object",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "JavaScript", value: "javascript" },
          { title: "TypeScript", value: "typescript" },
          { title: "HTML", value: "html" },
          { title: "CSS", value: "css" },
          { title: "JSON", value: "json" },
          { title: "Bash", value: "bash" },
          { title: "Python", value: "python" },
          { title: "Java", value: "java" },
          { title: "C#", value: "csharp" },
          { title: "PHP", value: "php" },
          { title: "Ruby", value: "ruby" },
          { title: "Go", value: "go" },
          { title: "Rust", value: "rust" },
          { title: "SQL", value: "sql" },
          { title: "YAML", value: "yaml" },
          { title: "XML", value: "xml" },
          { title: "Plain Text", value: "text" },
        ],
      },
      initialValue: "javascript",
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      rows: 10,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "filename",
      title: "Filename",
      type: "string",
      description: "Optional filename to display with the code block",
    }),
  ],
  preview: {
    select: {
      language: "language",
      filename: "filename",
    },
    prepare({ language, filename }) {
      return {
        title: `${language}${filename ? ` • ${filename}` : ""}`,
        subtitle: "Code Block",
      };
    },
  },
});
