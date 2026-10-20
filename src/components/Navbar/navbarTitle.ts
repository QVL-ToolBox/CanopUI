import type { CanopHeadingLevel, CanopHeadingTextElement } from "../Heading";

export type CanopNavbarTitleLevel = CanopHeadingLevel | "text";

export interface NavbarTitleSemantics {
  level?: CanopHeadingLevel;
  component?: CanopHeadingTextElement;
}

export function navbarTitleSemantics(titleLevel: CanopNavbarTitleLevel): NavbarTitleSemantics {
  return titleLevel === "text" ? { component: "p" } : { level: titleLevel };
}
