import Box from "@mui/material/Box";
import MuiStack from "@mui/material/Stack";
import {
  Card,
  HalloweenDecor,
  squircleClip,
  tokens,
  type CanopHalloweenDecorDensity,
} from "@canop/ui";

interface HalloweenStageProps {
  density: CanopHalloweenDecorDensity;
  title: string;
  body: string;
}

export function HalloweenStage({ density, title, body }: HalloweenStageProps) {
  return (
    <Box sx={[{ width: "100%", overflow: "hidden" }, squircleClip(tokens.radius.sm)]}>
      <HalloweenDecor density={density}>
        <MuiStack
          sx={{ alignItems: "center", justifyContent: "center", padding: 3, minHeight: "30rem" }}
        >
          <Card title={title}>{body}</Card>
        </MuiStack>
      </HalloweenDecor>
    </Box>
  );
}
