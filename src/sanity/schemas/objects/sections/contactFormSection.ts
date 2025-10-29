import { EnvelopeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const contactFormSection = defineType({
  name: "contactFormSection",
  title: "Contact Form",
  type: "object",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "blockContent",
    }),
    defineField({
      name: "formId",
      title: "Form identifier",
      type: "string",
      description:
        "Optional identifier used to connect this form to the downstream integration.",
    }),
    defineField({
      name: "recipientEmail",
      title: "Recipient email",
      type: "string",
      validation: (rule) => rule.email().warning("Add a valid email address"),
    }),
    defineField({
      name: "submitLabel",
      title: "Submit label",
      type: "string",
      initialValue: "Request demo",
    }),
    defineField({
      name: "successMessage",
      title: "Success message",
      type: "text",
      rows: 3,
      initialValue: "Thanks! We'll be in touch shortly.",
    }),
    defineField({
      name: "fields",
      title: "Form fields",
      type: "array",
      of: [
        defineArrayMember({
          name: "formField",
          title: "Form field",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Field name",
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .regex(/^[a-zA-Z0-9_]+$/, { name: "slug" })
                  .error(
                    "Use alphanumeric characters or underscores for the field name."
                  ),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "Text", value: "text" },
                  { title: "Email", value: "email" },
                  { title: "Company", value: "company" },
                  { title: "Phone", value: "phone" },
                  { title: "Textarea", value: "textarea" },
                  { title: "Select", value: "select" },
                ],
              },
              initialValue: "text",
            }),
            defineField({
              name: "placeholder",
              title: "Placeholder",
              type: "string",
            }),
            defineField({
              name: "required",
              title: "Required",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "options",
              title: "Options",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              hidden: ({ parent }) => parent?.type !== "select",
            }),
          ],
          preview: {
            select: {
              title: "label",
              type: "type",
            },
            prepare({ title, type }) {
              return {
                title: title ?? "Form field",
                subtitle: type ?? "text",
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).error("Add at least one form field"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      count: "fields",
    },
    prepare({ title, count }) {
      const total = Array.isArray(count) ? count.length : 0;
      return {
        title: title ?? "Contact form",
        subtitle: `${total} field${total === 1 ? "" : "s"}`,
      };
    },
  },
});
