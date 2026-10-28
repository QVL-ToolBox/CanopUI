import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { isModestDevice } from "../../motion/modestDevice";
import type { HalloweenDecorBudget } from "./halloweenSceneTypes";

export function useHalloweenDecorBudget(): HalloweenDecorBudget {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [modestDevice] = useState(isModestDevice);
  return smallScreen || modestDevice ? "lite" : "full";
}
