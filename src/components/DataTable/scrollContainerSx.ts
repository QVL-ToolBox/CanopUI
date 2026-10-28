import type { CSSObject } from "@mui/material/styles";
import { scrollShadowGutter } from "./rowSurface";

export interface ScrollContainerSxParams {
  fillHeight: boolean;
  maxHeight?: string | number;
  headerStuckToPage: boolean;
  scrollbar: CSSObject;
}

const shadowGutter: CSSObject = {
  paddingX: scrollShadowGutter,
  marginX: `-${scrollShadowGutter}`,
};

export function scrollContainerSx({
  fillHeight,
  maxHeight,
  headerStuckToPage,
  scrollbar,
}: ScrollContainerSxParams): CSSObject {
  if (fillHeight) {
    return { flex: 1, minHeight: 0, overflow: "auto", ...shadowGutter, ...scrollbar };
  }
  if (maxHeight != null) {
    return { maxHeight, overflow: "auto", ...shadowGutter, ...scrollbar };
  }
  if (headerStuckToPage) return { overflow: "visible" };
  return {
    overflowX: "auto",
    overflowY: "hidden",
    overscrollBehaviorX: "contain",
    ...shadowGutter,
    ...scrollbar,
  };
}
