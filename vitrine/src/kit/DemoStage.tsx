import Box from "@mui/material/Box";
import type { ReactNode } from "react";

export type DemoStageAlign = "center" | "start" | "stretch";

export interface DemoStageProps {
  align: DemoStageAlign;
  children: ReactNode;
}

const alignItems: Record<DemoStageAlign, string> = {
  center: "center",
  start: "flex-start",
  stretch: "stretch",
};

export function DemoStage({ align, children }: DemoStageProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: align === "stretch" ? "column" : "row",
        flexWrap: "wrap",
        gap: "1rem",
        alignItems: alignItems[align],
        justifyContent: align === "center" ? "center" : "flex-start",
        minWidth: 0,
        padding: { xs: "1.5rem 1rem", md: "2.5rem 2rem" },
        backgroundColor: "background.default",
        "& > *": { minWidth: 0, maxWidth: "100%" },
      }}
    >
      {children}
    </Box>
  );
}
