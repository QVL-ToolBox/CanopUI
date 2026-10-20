import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { Heading, Stack } from "@canop/ui";

export interface DocSectionProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function DocSection({ title, description, children }: DocSectionProps) {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Heading level={2} size={4} gutterBottom={false}>
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
      </Stack>
      {children}
    </Stack>
  );
}
