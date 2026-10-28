import Box from "@mui/material/Box";
import { Stack, Text, squircleClip, tokens } from "@canop/ui";

export interface SquircleDemoProps {
  roundedLabel: string;
  squircleLabel: string;
}

const SHAPE_SIZE = "4.5rem";
const CORNER = tokens.radius.lg;
const SHAPE_FILL =
  "linear-gradient(140deg, var(--canop-palette-primary-light), var(--canop-palette-primary-main))";

function Shape({ label, squircle }: { label: string; squircle: boolean }) {
  return (
    <Stack gap="xs" alignItems="center">
      <Box
        aria-hidden
        sx={[
          { width: SHAPE_SIZE, height: SHAPE_SIZE, background: SHAPE_FILL },
          squircle ? squircleClip(CORNER) : { borderRadius: CORNER },
        ]}
      />
      <Text variant="caption" tone="muted">
        {label}
      </Text>
    </Stack>
  );
}

export function SquircleDemo({ roundedLabel, squircleLabel }: SquircleDemoProps) {
  return (
    <Stack direction="row" gap="lg" justifyContent="center" wrap>
      <Shape label={roundedLabel} squircle={false} />
      <Shape label={squircleLabel} squircle />
    </Stack>
  );
}
