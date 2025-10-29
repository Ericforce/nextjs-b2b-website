import { author } from "./author";
import { blogPost } from "./blogPost";
import { category } from "./category";
import { page } from "./page";
import { reusableSection } from "./reusableSection";
import { siteSettings } from "./siteSettings";
import { tag } from "./tag";

export const documentSchemas = [
  siteSettings,
  page,
  blogPost,
  author,
  category,
  tag,
  reusableSection,
];
