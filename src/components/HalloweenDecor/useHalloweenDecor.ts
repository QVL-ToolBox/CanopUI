import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useReducedMotion } from "../../motion/useReducedMotion";
import { useDocumentVisible } from "../_shared/useDocumentVisible";
import { halloweenScene } from "./halloweenScene";
import type { CanopHalloweenDecorDensity, HalloweenScene } from "./halloweenSceneTypes";
import { halloweenToneVariables } from "./halloweenTones";
import { useHalloweenDecorBudget } from "./useHalloweenDecorBudget";
import { useIdleReady } from "./useIdleReady";

interface UseHalloweenDecorResult extends HalloweenScene {
  animated: boolean;
  tabHidden: boolean;
  revealed: boolean;
  toneVariables: Record<string, string>;
  overlayZIndex: number;
}

export function useHalloweenDecor(density: CanopHalloweenDecorDensity): UseHalloweenDecorResult {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const reducedMotion = useReducedMotion();
  const visible = useDocumentVisible();
  const budget = useHalloweenDecorBudget();
  const revealed = useIdleReady();

  const scene = useMemo(() => halloweenScene(density, budget), [density, budget]);
  const toneVariables = useMemo(() => halloweenToneVariables(mode), [mode]);

  return {
    ...scene,
    animated: !reducedMotion,
    tabHidden: !visible,
    revealed,
    toneVariables,
    overlayZIndex: theme.zIndex.tooltip + 1,
  };
}
