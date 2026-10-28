import Box from "@mui/material/Box";
import { fullLayer, lavaCanvasSx, lavaGlowSx, lavaSurfaceSx } from "./lavaPaint";
import type { LavaSettings } from "./lavaRecipe";
import { useLavaLamp } from "./useLavaLamp";
import type { LavaMotionState } from "./useLavaMotion";

export interface LavaFieldProps {
  lava: LavaSettings;
  motion: LavaMotionState;
}

export function LavaField({ lava, motion }: LavaFieldProps) {
  const lamp = useLavaLamp(lava, motion);

  return (
    <Box aria-hidden sx={{ ...fullLayer, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <Box sx={lavaSurfaceSx}>
        <Box ref={lamp.glowRef} sx={fullLayer}>
          {lamp.masses.map((mass) => (
            <Box key={mass.index} sx={lavaGlowSx(lava.hue, lava.mode, lava.intensity, mass)} />
          ))}
        </Box>
        <Box component="canvas" ref={lamp.canvasRef} sx={lavaCanvasSx} />
      </Box>
    </Box>
  );
}
