import ButtonBase from "@mui/material/ButtonBase";
import { squircleSurface } from "../../squircle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { hoverOrKeyboardFocus } from "../../interaction";
import { Icon } from "../Icon";
import type { CanopBreadcrumbItem } from "./breadcrumbTypes";

export interface BreadcrumbLinkProps {
  item: CanopBreadcrumbItem;
  isCurrent: boolean;
}

const labelSx = {
  maxWidth: { xs: "8rem", sm: "12rem" },
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "0.875rem",
} as const;

export function BreadcrumbLink({ item, isCurrent }: BreadcrumbLinkProps) {
  const content = (
    <Stack
      component="span"
      direction="row"
      spacing={0.5}
      sx={{
        alignItems: "center",
        minWidth: 0,
        display: "inline-flex",
      }}
    >
      {item.icon && <Icon name={item.icon} variant="outline" size="sm" color="inherit" />}
      <Typography component="span" sx={labelSx}>
        {item.label}
      </Typography>
    </Stack>
  );

  if (isCurrent || !item.onClick) {
    return (
      <Typography
        component="span"
        aria-current={isCurrent ? "page" : undefined}
        sx={{ color: "text.primary", fontWeight: 600, display: "inline-flex", minWidth: 0 }}
      >
        {content}
      </Typography>
    );
  }

  return (
    <ButtonBase
      onClick={item.onClick}
      sx={{
        ...squircleSurface({ radius: "var(--canop-radius-sm)", background: "transparent" }),
        borderRadius: "var(--canop-radius-sm)",
        paddingX: "0.375rem",
        paddingY: "0.125rem",
        color: "text.secondary",
        transition: "color var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)",
        [hoverOrKeyboardFocus()]: { color: "primary.main", textDecoration: "underline" },
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      {content}
    </ButtonBase>
  );
}
