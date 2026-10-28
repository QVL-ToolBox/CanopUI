import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { tokens } from "../../tokens";
import { avoidPageTopRight } from "../_shared/pageTopRightInset";
import { titleTag, type CanopTitleLevel } from "../_shared/titleLevel";

const { app } = tokens.typography;

const GUTTER = { xs: "1rem", md: "2.5rem" };

export interface CanopPageHeaderProps {
  title?: string;
  titleLevel?: CanopTitleLevel;
  context?: string;
  subtitle?: string;
  actions?: ReactNode;
  compact?: boolean;
}

export function PageHeader({
  title,
  titleLevel = 1,
  context,
  subtitle,
  actions,
  compact = false,
}: CanopPageHeaderProps) {
  if (!title && !context && !subtitle && !actions) return null;

  return (
    <Stack
      component="header"
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        flexShrink: 0,
        bgcolor: "background.paper",
        color: "text.primary",
        paddingLeft: GUTTER,
        paddingRight: {
          xs: avoidPageTopRight(GUTTER.xs),
          md: avoidPageTopRight(GUTTER.md),
        },
        paddingY: { xs: "1rem", md: "1.5rem" },
        boxShadow: "var(--canop-shadow-e2)",
      }}
    >
      <Stack
        spacing={0.25}
        sx={{
          minWidth: 0,
        }}
      >
        {context ? (
          <Typography
            component="p"
            sx={{
              color: "text.secondary",
              ...app.overline,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {context}
          </Typography>
        ) : null}
        {title ? (
          <Typography
            component={titleTag(titleLevel)}
            sx={compact ? app["title-md"] : app["title-lg"]}
          >
            {title}
          </Typography>
        ) : null}
        {subtitle ? (
          <Typography
            component="p"
            sx={[
              {
                color: "text.secondary",
              },
              app["body-md"],
            ]}
          >
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
      {actions ? (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{
            alignItems: "center",
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          {actions}
        </Stack>
      ) : null}
    </Stack>
  );
}
