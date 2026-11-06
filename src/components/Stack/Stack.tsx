import Box from "@mui/material/Box";
import type { FormEventHandler, ReactNode, Ref } from "react";
import { tokens } from "../../tokens";
import type { CanopDataAttributes } from "../_shared/dataAttributes";
import { mapResponsive, type CanopResponsiveValue } from "../_shared/responsiveValue";

export type { CanopResponsiveValue };

export type CanopStackGap = "xs" | "sm" | "md" | "lg" | "xl";
export type CanopStackElement = "div" | "form" | "nav" | "section";
export type CanopStackDirection = "row" | "column";
export type CanopStackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type CanopStackJustify =
  "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
export type CanopStackPadding = CanopStackGap | "none";
export type CanopStackSticky = "top" | "bottom";

const alignMap: Record<CanopStackAlign, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};

const justifyMap: Record<CanopStackJustify, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  "space-between": "space-between",
  "space-around": "space-around",
  "space-evenly": "space-evenly",
};

export type CanopStackRole =
  "group" | "radiogroup" | "toolbar" | "list" | "listitem" | "presentation" | "none";

export interface CanopStackProps extends CanopDataAttributes {
  ref?: Ref<HTMLElement>;
  ariaBusy?: boolean;
  gap?: CanopStackGap;
  direction?: CanopResponsiveValue<CanopStackDirection>;
  alignItems?: CanopStackAlign;
  justifyContent?: CanopStackJustify;
  wrap?: CanopResponsiveValue<boolean>;
  padding?: CanopStackPadding;
  as?: CanopStackElement;
  ariaLabel?: string;
  role?: CanopStackRole;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  fill?: boolean;
  weight?: number;
  sticky?: CanopStackSticky;
  stickyOffset?: CanopStackPadding;
  children: ReactNode;
}

const STICKY_LAYER_ABOVE_SCROLLING_SIBLINGS = 1;

function flexWrapOf(wraps: boolean): "wrap" | "nowrap" {
  return wraps ? "wrap" : "nowrap";
}

export function Stack({
  ref,
  ariaBusy,
  gap = "md",
  direction = "column",
  alignItems,
  justifyContent,
  wrap = false,
  padding = "none",
  as = "div",
  ariaLabel,
  role,
  onSubmit,
  fill = false,
  weight,
  sticky,
  stickyOffset = "none",
  children,
  ...dataAttributes
}: CanopStackProps) {
  const shares = fill || weight !== undefined;
  const edgeOffset = stickyOffset === "none" ? 0 : tokens.spacing[stickyOffset];
  const stick = sticky
    ? {
        position: "sticky" as const,
        top: sticky === "top" ? edgeOffset : undefined,
        bottom: sticky === "bottom" ? edgeOffset : undefined,
        zIndex: STICKY_LAYER_ABOVE_SCROLLING_SIBLINGS,
      }
    : {};
  return (
    <Box
      {...dataAttributes}
      ref={ref}
      component={as}
      aria-label={ariaLabel}
      aria-busy={ariaBusy}
      role={role}
      onSubmit={onSubmit}
      sx={{
        ...(shares ? { flex: `${weight ?? 1} 1 0%`, minHeight: 0 } : {}),
        ...stick,
        minWidth: 0,
        display: "flex",
        flexDirection: direction,
        flexWrap: mapResponsive(wrap, flexWrapOf),
        gap: tokens.spacing[gap],
        alignItems: alignItems ? alignMap[alignItems] : undefined,
        justifyContent: justifyContent ? justifyMap[justifyContent] : undefined,
        padding: padding === "none" ? undefined : tokens.spacing[padding],
      }}
    >
      {children}
    </Box>
  );
}
