import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Heading, Stack } from "@canop/ui";
import { CodeBlock } from "./CodeBlock";

export interface DocPageProps {
  title: string;
  intro: string;
  importCode?: string;
  children: ReactNode;
}

export function DocPage({ title, intro, importCode, children }: DocPageProps) {
  return (
    <Box
      sx={{
        maxWidth: "52rem",
      }}
    >
      <Stack gap="xl">
        <Stack gap="sm">
          <Heading level={1} size={3} gutterBottom={false}>
            {title}
          </Heading>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            {intro}
          </Typography>
        </Stack>
        {importCode ? <CodeBlock code={importCode} /> : null}
        {children}
      </Stack>
    </Box>
  );
}
