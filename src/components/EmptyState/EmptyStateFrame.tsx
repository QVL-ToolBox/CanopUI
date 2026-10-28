import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";
import type { EmptyStateSizeRecipe } from "./emptyStateSizes";

export interface EmptyStateFrameProps {
  children: ReactNode;
  minHeight: string;
  recipe: EmptyStateSizeRecipe;
}

export function EmptyStateFrame({ children, minHeight, recipe }: EmptyStateFrameProps) {
  return (
    <Stack
      sx={{
        width: "100%",
        boxSizing: "border-box",
        minHeight,
        alignItems: "center",
        justifyContent: "center",
        padding: recipe.framePadding,
      }}
    >
      <Stack sx={{ width: "100%", maxWidth: recipe.contentMaxWidth }}>{children}</Stack>
    </Stack>
  );
}
