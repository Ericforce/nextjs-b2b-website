import { blockContent } from "./blockContent";
import { callout } from "./callout";
import { link } from "./link";
import { navigationGroup } from "./navigationGroup";
import { sectionObjects } from "./sections";
import { seo } from "./seo";
import { socialImage } from "./socialImage";
import { socialLink } from "./socialLink";

export const objectSchemas = [
  link,
  navigationGroup,
  socialLink,
  socialImage,
  seo,
  callout,
  blockContent,
  ...sectionObjects,
];
