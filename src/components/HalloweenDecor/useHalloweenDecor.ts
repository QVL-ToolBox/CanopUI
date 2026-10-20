import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useReducedMotion } from "../../motion/useReducedMotion";
import { halloweenScene } from "./halloweenScene";
import type { CanopHalloweenDecorDensity, HalloweenScene } from "./halloweenSceneTypes";
import { halloweenToneVariables } from "./halloweenTones";
import { useDocumentVisible } from "./useDocumentVisible";

interface UseHalloweenDecorResult extends HalloweenScene {
  animated: boolean;
  paused: boolean;
  toneVariables: Record<string, string>;
  overlayZIndex: number;
}

export function useHalloweenDecor(density: CanopHalloweenDecorDensity): UseHalloweenDecorResult {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const reducedMotion = useReducedMotion();
  const visible = useDocumentVisible();

  const scene = useMemo(() => halloweenScene(density), [density]);
  const toneVariables = useMemo(() => halloweenToneVariables(mode), [mode]);

  return {
    ...scene,
    animated: !reducedMotion,
    paused: !visible,
    toneVariables,
    overlayZIndex: theme.zIndex.tooltip + 1,
  };
}
