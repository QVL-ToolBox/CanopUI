import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Button, Heading, Icon, squircleClip, Stack, tokens } from "@canop/ui";
import { CodeBlock } from "./CodeBlock";
import { useDemoCard } from "./useDemoCard";
import { useDocLocale } from "../i18n/useDocLocale";

const labels = {
  fr: {
    showCode: "Afficher le code",
    hideCode: "Masquer le code",
    copy: "Copier",
    copied: "Copié !",
  },
  en: {
    showCode: "Show code",
    hideCode: "Hide code",
    copy: "Copy",
    copied: "Copied!",
  },
};

export interface DemoCardProps {
  title: string;
  description?: string;
  code: string;
  align?: "center" | "start" | "stretch";
  children: ReactNode;
}

const alignMap = {
  center: "center",
  start: "flex-start",
  stretch: "stretch",
} as const;

export function DemoCard({ title, description, code, align = "center", children }: DemoCardProps) {
  const { showCode, toggleCode, copied, copy } = useDemoCard(code);
  const t = labels[useDocLocale()];

  return (
    <Stack gap="sm">
      <Heading level={3} size={5} gutterBottom={false}>
        {title}
      </Heading>
      {description ? (
        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          {description}
        </Typography>
      ) : null}
      <Box
        sx={{
          padding: "0.0625rem",
          ...squircleClip(tokens.radius.sm),
          backgroundColor: "var(--canop-palette-divider)",
        }}
      >
        <Box sx={squircleClip(`calc(${tokens.radius.sm} - 0.0625rem)`)}>
          <Box
            sx={[
              {
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: alignMap[align],
                justifyContent: align === "center" ? "center" : "flex-start",
                padding: { xs: "1.5rem 1rem", md: "2.5rem 2rem" },
                bgcolor: "background.default",
              },
              align === "stretch" ? { flexDirection: "column" } : false,
            ]}
          >
            {children}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
              padding: "0.5rem 0.75rem",
              borderTop: "0.0625rem solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Button
              variant="tonal"
              size="small"
              onClick={toggleCode}
              startIcon={<Icon name={showCode ? "eyeOff" : "eye"} size="xs" />}
            >
              {showCode ? t.hideCode : t.showCode}
            </Button>
            <Button
              variant="tonal"
              size="small"
              onClick={copy}
              startIcon={<Icon name={copied ? "check" : "file"} size="xs" />}
            >
              {copied ? t.copied : t.copy}
            </Button>
          </Box>
          <Collapse in={showCode}>
            <Box
              sx={{
                borderTop: "0.0625rem solid",
                borderColor: "divider",
              }}
            >
              <CodeBlock code={code} bare />
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Stack>
  );
}
