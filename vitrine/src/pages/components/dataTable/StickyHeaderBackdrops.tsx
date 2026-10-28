import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { Card } from "@canop/ui";
import { CanopyBackdrop } from "../input/CanopyBackdrop";
import { NotchBackdropTile } from "../input/NotchBackdropTile";
import { PaintedBackdrop } from "../input/PaintedBackdrop";

export interface StickyHeaderBackdropsLabels {
  theme: string;
  card: string;
  image: string;
  frosted: string;
}

export interface StickyHeaderBackdropsProps {
  labels: StickyHeaderBackdropsLabels;
  table: ReactNode;
}

const THEME_PAINT = "var(--canop-palette-background-default)";

export function StickyHeaderBackdrops({ labels, table }: StickyHeaderBackdropsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "repeat(2, minmax(0, 1fr))" },
        gap: 3,
        width: "100%",
      }}
    >
      <NotchBackdropTile title={labels.theme}>
        <PaintedBackdrop paint={THEME_PAINT}>{table}</PaintedBackdrop>
      </NotchBackdropTile>
      <NotchBackdropTile title={labels.card}>
        <Card>{table}</Card>
      </NotchBackdropTile>
      <NotchBackdropTile title={labels.image}>
        <CanopyBackdrop animated={false}>{table}</CanopyBackdrop>
      </NotchBackdropTile>
      <NotchBackdropTile title={labels.frosted}>
        <CanopyBackdrop animated>
          <Card variant="frosted">{table}</Card>
        </CanopyBackdrop>
      </NotchBackdropTile>
    </Box>
  );
}
