import type { CanopHeadingLevel, CanopHeadingTextElement } from "../Heading";

export type CanopTitleLevel = CanopHeadingLevel | "text";

export interface TitleSemantics {
  level?: CanopHeadingLevel;
  component?: CanopHeadingTextElement;
}

export function titleSemantics(titleLevel: CanopTitleLevel): TitleSemantics {
  return titleLevel === "text" ? { component: "p" } : { level: titleLevel };
}

export function titleTag(titleLevel: CanopTitleLevel): "p" | `h${CanopHeadingLevel}` {
  return titleLevel === "text" ? "p" : `h${titleLevel}`;
}
