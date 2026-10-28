import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { Card, Icon, Stack, Text, squircleClip, tokens, type CanopIconName } from "@canop/ui";

export interface FeatureTileProps {
  icon: CanopIconName;
  title: string;
  description: string;
  href: string;
  demo?: ReactNode;
}

const BADGE_SIZE = "2.5rem";
const BADGE_FILL = "color-mix(in srgb, var(--canop-palette-primary-main) 14%, transparent)";

function FeatureBadge({ icon }: { icon: CanopIconName }) {
  return (
    <Box
      sx={[
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          width: BADGE_SIZE,
          height: BADGE_SIZE,
          background: BADGE_FILL,
        },
        squircleClip(tokens.radius.sm),
      ]}
    >
      <Icon name={icon} variant="solid" size="sm" color="primary" />
    </Box>
  );
}

export function FeatureTile({ icon, title, description, href, demo }: FeatureTileProps) {
  return (
    <Card variant="interactive" fill arrow title={title} href={href} ariaLabel={title}>
      <Stack gap="lg" fill justifyContent="space-between">
        <Stack direction="row" gap="sm" alignItems="start">
          <FeatureBadge icon={icon} />
          <Text variant="body-sm" tone="muted">
            {description}
          </Text>
        </Stack>
        {demo}
      </Stack>
    </Card>
  );
}
