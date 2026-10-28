import type { CSSObject } from "@mui/material/styles";
import type { CanopHalloweenDecorScope } from "./halloweenSceneTypes";

const PAUSED_EVERYWHERE: CSSObject = {
  "&, & *": { animationPlayState: "paused !important" },
};

const SKIPPED_OFFSCREEN: CSSObject = { contentVisibility: "auto" };

const DECOR_ROOT: CSSObject = { position: "relative", isolation: "isolate" };

const BEHIND_PAGE_CONTENT: CSSObject = { ...DECOR_ROOT, zIndex: -1 };

export const decorContentSx: CSSObject = { position: "relative", zIndex: 1 };

export function decorRootSx(behindPageContent: boolean): CSSObject {
  return behindPageContent ? BEHIND_PAGE_CONTENT : DECOR_ROOT;
}

export interface DecorLayerState {
  scope: CanopHalloweenDecorScope;
  paused: boolean;
  revealed: boolean;
}

export function decorLayerSx({ scope, paused, revealed }: DecorLayerState): CSSObject {
  return {
    position: scope === "viewport" ? "fixed" : "absolute",
    inset: 0,
    zIndex: 0,
    overflow: "hidden",
    pointerEvents: "none",
    contain: "layout paint",
    ...(scope === "container" ? SKIPPED_OFFSCREEN : {}),
    opacity: revealed ? 1 : 0,
    transition: "opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
    ...(paused ? PAUSED_EVERYWHERE : {}),
    "@media (prefers-reduced-motion: reduce)": {
      transition: "none",
      "& *": { animation: "none" },
    },
  };
}

export function overlayLayerSx(state: DecorLayerState, zIndex: number): CSSObject {
  return { ...decorLayerSx(state), zIndex };
}
