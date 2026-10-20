import Box from "@mui/material/Box";
import { fireflySx } from "./atmosphereSx";
import type { HalloweenFireflySpec } from "./halloweenSceneTypes";

interface HalloweenFireflyProps {
  spec: HalloweenFireflySpec;
  animated: boolean;
}

export function HalloweenFirefly({ spec, animated }: HalloweenFireflyProps) {
  return <Box sx={fireflySx(spec, animated)} />;
}
