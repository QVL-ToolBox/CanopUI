import Box from "@mui/material/Box";
import type { MouseEvent, ReactNode } from "react";
import { squircleClip } from "@canop/ui";

const panelEnterSx = {
  "@media (prefers-reduced-motion: no-preference)": {
    transformOrigin: "top center",
    animation:
      "shellSearchPanelEnter var(--canop-motion-duration-base) var(--canop-motion-ease-organic) both",
    "@keyframes shellSearchPanelEnter": {
      from: { opacity: 0, transform: "translateY(-0.375rem) scale(0.98)" },
      to: { opacity: 1, transform: "none" },
    },
  },
} as const;

export interface SearchResultsPanelProps {
  onMouseDown: (event: MouseEvent) => void;
  children: ReactNode;
}

export function SearchResultsPanel({ onMouseDown, children }: SearchResultsPanelProps) {
  return (
    <Box
      onMouseDown={onMouseDown}
      sx={{
        position: "absolute",
        top: "calc(100% + 0.5rem)",
        left: 0,
        right: 0,
        zIndex: 1,
        filter: "var(--canop-drop-shadow-e4)",
        ...panelEnterSx,
      }}
    >
      <Box
        sx={{
          ...squircleClip("var(--canop-radius-xl)"),
          backgroundColor: "var(--canop-palette-surface-raised)",
          overflow: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
