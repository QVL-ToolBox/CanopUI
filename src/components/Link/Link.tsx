import MuiLink from "@mui/material/Link";
import type { ElementType, ReactNode } from "react";
import { keyboardFocus, withoutFocusRing } from "../../interaction";
import { tokens } from "../../tokens";
import { singleLineEllipsis } from "../_shared/truncation";
import { LinkNewTabHint } from "./LinkNewTabHint";
import { linkTargetProps } from "./linkTargetProps";

export type CanopLinkSize = "xsmall" | "small" | "medium";
export type CanopLinkColor = "primary" | "secondary" | "accent" | "muted";

export interface CanopLinkProps {
  href?: string;

  component?: ElementType;

  to?: string;

  size?: CanopLinkSize;
  color?: CanopLinkColor;
  noWrap?: boolean;
  external?: boolean;
  children: ReactNode;
}

const sizeMapping = {
  xsmall: tokens.typography.fontSize.xs,
  small: tokens.typography.fontSize.sm,
  medium: tokens.typography.fontSize.md,
} as const;

const colorMapping = {
  primary: "primary.main",
  secondary: "secondary.main",
  accent: "accent.main",
  muted: "text.secondary",
} as const;

const Root = MuiLink as ElementType;

const TRUNCATED_INLINE = {
  ...singleLineEllipsis,
  display: "inline-block",
  verticalAlign: "bottom",
};

export function Link({
  href,
  component,
  to,
  size = "medium",
  color = "accent",
  noWrap = false,
  external = false,
  children,
}: CanopLinkProps) {
  const target = linkTargetProps({ href, component, to, external });
  return (
    <Root
      {...target}
      underline="hover"
      variant="body1"
      sx={{
        fontSize: sizeMapping[size],
        color: colorMapping[color],
        ...(noWrap ? TRUNCATED_INLINE : null),
        ...withoutFocusRing,
        [keyboardFocus()]: { textDecoration: "underline" },
      }}
    >
      {children}
      {external && <LinkNewTabHint />}
    </Root>
  );
}
