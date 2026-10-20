import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import type { CanopDonutGeometry } from "./useDonut";

interface DonutLegendProps {
  geometries: CanopDonutGeometry[];
}

export function DonutLegend({ geometries }: DonutLegendProps) {
  return (
    <Box
      component="ul"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.75rem",
        margin: 0,
        padding: 0,
        listStyle: "none",
      }}
    >
      {geometries.map((geometry) => (
        <Box
          component="li"
          key={geometry.key}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.8125rem",
            color: "text.secondary",
          }}
        >
          <Box
            sx={{
              width: "0.75rem",
              height: "0.75rem",
              flexShrink: 0,
              ...squircleClip("var(--canop-radius-xs)"),
              backgroundColor: geometry.color,
            }}
          />
          <Box
            component="span"
            sx={{
              color: "text.primary",
              fontWeight: 600,
            }}
          >
            {geometry.label}
          </Box>
          <Box component="span">{geometry.valueLabel}</Box>
        </Box>
      ))}
    </Box>
  );
}
