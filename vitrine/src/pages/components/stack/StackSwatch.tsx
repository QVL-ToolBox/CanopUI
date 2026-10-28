import Box from "@mui/material/Box";
import { squircleClip, tokens } from "@canop/ui";

export type StackSwatchColor = "primary" | "secondary" | "accent";

export interface StackSwatchProps {
  color: StackSwatchColor;
  width?: string;
  height?: string;
}

export function StackSwatch({ color, width, height = "3rem" }: StackSwatchProps) {
  return (
    <Box
      sx={[
        { bgcolor: `${color}.main`, width, height, maxWidth: "100%" },
        squircleClip(tokens.radius.xs),
      ]}
    />
  );
}
