import type { CSSObject } from "@mui/material/styles";

const PAGE_BOTTOM_INSET_VAR = "--canop-page-bottom-inset";

const inset = `var(${PAGE_BOTTOM_INSET_VAR}, 0rem)`;

export function reservePageBottom(space: string): CSSObject {
  return { [PAGE_BOTTOM_INSET_VAR]: space, paddingBottom: space };
}

export function bleedThroughPageBottom(): CSSObject {
  return { marginBottom: `calc(-1 * ${inset})` };
}

export function keepAbovePageBottom(): string {
  return inset;
}
