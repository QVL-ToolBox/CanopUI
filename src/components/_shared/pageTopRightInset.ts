import type { CSSObject } from "@mui/material/styles";

export const PAGE_TOP_RIGHT_INSET_VAR = "--canop-page-top-right-inset";

const inset = `var(${PAGE_TOP_RIGHT_INSET_VAR}, 0rem)`;

export function reservePageTopRight(space: string): CSSObject {
  return { [PAGE_TOP_RIGHT_INSET_VAR]: space };
}

export function avoidPageTopRight(base: string): string {
  return `max(${base}, ${inset})`;
}
