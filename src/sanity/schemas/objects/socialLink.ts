import { ShareIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const socialPlatforms = [
  { title: "Twitter / X", value: "twitter" },
  { title: "LinkedIn", value: "linkedin" },
  { title: "GitHub", value: "github" },
  { title: "YouTube", value: "youtube" },
  { title: "Facebook", value: "facebook" },
  { title: "Instagram", value: "instagram" },
  { title: "TikTok", value: "tiktok" },
] as const;

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  icon: ShareIcon,
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: socialPlatforms,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "handle",
      title: "Handle",
      type: "string",
      description: "The username or handle, without the @ symbol.",
    }),
    defineField({
      name: "url",
      title: "Profile URL",
      type: "url",
      validation: (rule) =>
        rule.uri({
          allowRelative: false,
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "icon",
      title: "Override icon",
      type: "string",
      description:
        "Optional icon slug if the platform is not in the default set.",
    }),
  ],
  preview: {
    select: {
      platform: "platform",
      handle: "handle",
    },
    prepare({ platform, handle }) {
      return {
        title: handle ? `@${handle}` : "Social profile",
        subtitle: platform ?? "Custom",
      };
    },
  },
});
