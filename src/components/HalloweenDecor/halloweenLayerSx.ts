import type { CSSObject } from "@mui/material/styles";
import type { CanopHalloweenDecorScope } from "./halloweenSceneTypes";

const PAUSED_EVERYWHERE: CSSObject = {
  "&, & *": { animationPlayState: "paused !important" },
};

const DECOR_ROOT: CSSObject = { position: "relative", isolation: "isolate" };

const BEHIND_PAGE_CONTENT: CSSObject = { ...DECOR_ROOT, zIndex: -1 };

export const decorContentSx: CSSObject = { position: "relative", zIndex: 1 };

export function decorRootSx(behindPageContent: boolean): CSSObject {
  return behindPageContent ? BEHIND_PAGE_CONTENT : DECOR_ROOT;
}

export function decorLayerSx(scope: CanopHalloweenDecorScope, paused: boolean): CSSObject {
  return {
    position: scope === "viewport" ? "fixed" : "absolute",
    inset: 0,
    zIndex: 0,
    overflow: "hidden",
    pointerEvents: "none",
    contain: "layout paint",
    ...(paused ? PAUSED_EVERYWHERE : {}),
    "@media (prefers-reduced-motion: reduce)": {
      "& *": { animation: "none" },
    },
  };
}

export function overlayLayerSx(
  scope: CanopHalloweenDecorScope,
  paused: boolean,
  zIndex: number,
): CSSObject {
  return { ...decorLayerSx(scope, paused), zIndex };
}
