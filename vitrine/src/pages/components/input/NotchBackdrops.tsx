import Box from "@mui/material/Box";
import { Card } from "@canop/ui";
import { CanopyBackdrop } from "./CanopyBackdrop";
import { NotchBackdropTile } from "./NotchBackdropTile";
import { NotchFieldSet, type NotchFieldSetLabels } from "./NotchFieldSet";
import { PaintedBackdrop } from "./PaintedBackdrop";

export interface NotchBackdropsLabels {
  fields: NotchFieldSetLabels;
  theme: string;
  tonalCard: string;
  solid: string;
  gradient: string;
  image: string;
  frosted: string;
}

export interface NotchBackdropsProps {
  labels: NotchBackdropsLabels;
}

const THEME_PAINT = "var(--canop-palette-background-default)";
const SOLID_PAINT = "var(--canop-palette-accent-light)";
const GRADIENT_PAINT =
  "linear-gradient(135deg, var(--canop-palette-primary-light), var(--canop-palette-accent-light))";

export function NotchBackdrops({ labels }: NotchBackdropsProps) {
  const fields = <NotchFieldSet labels={labels.fields} />;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" },
        gap: 3,
        width: "100%",
      }}
    >
      <NotchBackdropTile title={labels.theme}>
        <PaintedBackdrop paint={THEME_PAINT}>{fields}</PaintedBackdrop>
      </NotchBackdropTile>
      <NotchBackdropTile title={labels.tonalCard}>
        <Card tone="warning">{fields}</Card>
      </NotchBackdropTile>
      <NotchBackdropTile title={labels.solid}>
        <PaintedBackdrop paint={SOLID_PAINT}>{fields}</PaintedBackdrop>
      </NotchBackdropTile>
      <NotchBackdropTile title={labels.gradient}>
        <PaintedBackdrop paint={GRADIENT_PAINT}>{fields}</PaintedBackdrop>
      </NotchBackdropTile>
      <NotchBackdropTile title={labels.image}>
        <CanopyBackdrop animated={false}>{fields}</CanopyBackdrop>
      </NotchBackdropTile>
      <NotchBackdropTile title={labels.frosted}>
        <CanopyBackdrop animated>
          <Card variant="frosted">{fields}</Card>
        </CanopyBackdrop>
      </NotchBackdropTile>
    </Box>
  );
}
