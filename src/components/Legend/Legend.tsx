import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import type { CanopStatusTone } from "../StatusChip";

export type CanopLegendTone = Extract<
  CanopStatusTone,
  "neutral" | "info" | "success" | "warning" | "error"
>;

export interface CanopLegendToneEntry {
  tone: CanopLegendTone;
  label: string;
}

export interface CanopLegendColorEntry {
  /**
   * Un jeton de couleur du thème — `"background.paper"`, `"primary.light"` —
   * pour les entrées qu'aucune tonalité sémantique ne décrit.
   *
   * Une légende explique un code couleur : elle ne vaut que si sa pastille
   * porte **la couleur réellement employée**. Les quatre tonalités couvrent les
   * états, pas les surfaces, et `neutral` est câblé sur `text.secondary` : une
   * carte au repos, peinte en `background.paper`, n'avait donc aucune pastille
   * juste, et le seul recours honnête était de retirer l'entrée de la légende.
   */
  color: string;
  label: string;
}

export type CanopLegendEntry = CanopLegendToneEntry | CanopLegendColorEntry;

export interface CanopLegendProps {
  items: CanopLegendEntry[];
}

const toneColor: Record<CanopLegendTone, string> = {
  neutral: "text.secondary",
  info: "info.main",
  success: "success.main",
  warning: "warning.main",
  error: "error.main",
};

function swatchColor(entry: CanopLegendEntry): string {
  return "color" in entry ? entry.color : toneColor[entry.tone];
}

export function Legend({ items }: CanopLegendProps) {
  return (
    <Box
      component="ul"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "1rem",
        margin: "0",
        padding: "0",
        listStyle: "none",
      }}
    >
      {items.map((item) => (
        <Box
          component="li"
          key={`${swatchColor(item)}-${item.label}`}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "text.secondary",
            fontSize: "0.875rem",
          }}
        >
          <Box
            sx={[
              {
                width: "0.75rem",
                height: "0.75rem",
                bgcolor: swatchColor(item),
                flexShrink: 0,
              },
              squircleClip("50%", { shape: "circle" }),
            ]}
          />
          {item.label}
        </Box>
      ))}
    </Box>
  );
}
