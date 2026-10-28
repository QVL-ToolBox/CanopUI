import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import type { ReactNode } from "react";
import { Button, Heading, Icon, Stack, Text, squircleClip, tokens } from "@canop/ui";
import { CodeBlock } from "./CodeBlock";
import { CopyCodeButton } from "./CopyCodeButton";
import { DemoStage, type DemoStageAlign } from "./DemoStage";
import { useDemoCard } from "./useDemoCard";

export interface DemoCardProps {
  title: string;
  description?: string;
  code: string;
  align?: DemoStageAlign;
  children: ReactNode;
}

const FRAME_RADIUS = tokens.radius.sm;
const HAIRLINE = "0.0625rem";
const HAIRLINE_BORDER = `${HAIRLINE} solid var(--canop-palette-divider)`;

export function DemoCard({ title, description, code, align = "center", children }: DemoCardProps) {
  const { showCode, toggleCode, toggleLabel, codeRevealTimeout } = useDemoCard();

  return (
    <Stack gap="sm">
      <Heading level={3} size={{ xs: 6, md: 5 }} gutterBottom={false}>
        {title}
      </Heading>
      {description ? <Text tone="muted">{description}</Text> : null}
      <Box
        sx={{
          minWidth: 0,
          padding: HAIRLINE,
          backgroundColor: "var(--canop-palette-divider)",
          ...squircleClip(FRAME_RADIUS),
        }}
      >
        <Box sx={{ minWidth: 0, ...squircleClip(`calc(${FRAME_RADIUS} - ${HAIRLINE})`) }}>
          <DemoStage align={align}>{children}</DemoStage>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: "0.5rem",
              padding: "0.5rem 0.75rem",
              borderTop: HAIRLINE_BORDER,
              backgroundColor: "background.paper",
            }}
          >
            <Button
              variant="tonal"
              size="small"
              onClick={toggleCode}
              startIcon={<Icon name={showCode ? "eyeOff" : "eye"} size="xs" />}
            >
              {toggleLabel}
            </Button>
            <CopyCodeButton code={code} />
          </Box>
          <Collapse in={showCode} timeout={codeRevealTimeout}>
            <Box sx={{ borderTop: HAIRLINE_BORDER }}>
              <CodeBlock code={code} bare />
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Stack>
  );
}
