import Box from "@mui/material/Box";
import { Card, Icon, Stack, Text, squircleClip, tokens } from "@canop/ui";

export interface GlassDemoProps {
  label: string;
}

const BACKDROP = [
  "radial-gradient(circle at 20% 30%, var(--canop-palette-accent-main) 0 18%, transparent 19%),",
  "radial-gradient(circle at 80% 70%, var(--canop-palette-primary-main) 0 22%, transparent 23%),",
  "linear-gradient(135deg, var(--canop-palette-primary-light), var(--canop-palette-accent-light))",
].join(" ");

export function GlassDemo({ label }: GlassDemoProps) {
  return (
    <Box
      aria-hidden
      sx={[{ padding: tokens.spacing.md, background: BACKDROP }, squircleClip(tokens.radius.md)]}
    >
      <Card variant="frosted" density="dense">
        <Stack direction="row" gap="sm" alignItems="center">
          <Icon name="diamond" size="sm" color="primary" />
          <Text variant="label">{label}</Text>
        </Stack>
      </Card>
    </Box>
  );
}
