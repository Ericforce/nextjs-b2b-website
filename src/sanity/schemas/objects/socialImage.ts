import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const socialImage = defineType({
  name: "socialImage",
  title: "Social Image",
  type: "image",
  icon: ImageIcon,
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the content of the image for accessibility.",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
});
