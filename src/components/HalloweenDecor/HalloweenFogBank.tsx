import Box from "@mui/material/Box";
import { fogLayerSx } from "./atmosphereSx";

interface HalloweenFogBankProps {
  depth: "near" | "far";
  animated: boolean;
}

export function HalloweenFogBank({ depth, animated }: HalloweenFogBankProps) {
  return <Box sx={fogLayerSx(depth, animated)} />;
}
