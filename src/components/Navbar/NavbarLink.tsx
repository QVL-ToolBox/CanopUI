import Box from "@mui/material/Box";
import type { MouseEvent, ReactNode } from "react";
import { Icon, type CanopIconName } from "../Icon";
import { NavbarActiveIndicator } from "./NavbarActiveIndicator";
import { squircleFill, squircleSurface } from "../../squircle";
import { NAVBAR_HOVER_OVERLAY } from "./navbarStyles";

export interface NavbarLinkProps {
  href: string;
  label: string;
  icon?: CanopIconName;
  active: boolean;
  showIndicator?: boolean;
  nested?: boolean;
  expanded?: boolean;
  controls?: string;
  onClick: (event: MouseEvent) => void;
  trailing?: ReactNode;
}

export function NavbarLink({
  href,
  label,
  icon,
  active,
  showIndicator = active,
  nested = false,
  expanded,
  controls,
  onClick,
  trailing,
}: NavbarLinkProps) {
  return (
    <Box
      component="a"
      href={href}
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      aria-current={showIndicator ? "page" : undefined}
      onClick={onClick}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: nested ? "0.5rem 0.75rem" : "0.75rem 0.875rem",
        ...squircleSurface({ radius: "var(--canop-radius-md)", background: "transparent" }),
        color: active ? "primary.main" : "primary.contrastText",
        fontWeight: active ? 600 : 400,
        fontSize: nested ? "0.9375rem" : "1rem",
        textDecoration: "none",
        cursor: "pointer",
        transition: "color var(--canop-motion-duration-fast) var(--canop-motion-ease-standard)",
        "&:hover": active ? {} : squircleFill(NAVBAR_HOVER_OVERLAY),
        "&:focus-visible": {
          outline: "0.125rem solid var(--canop-palette-accent-main)",
          outlineOffset: "0.125rem",
        },
      }}
    >
      {showIndicator && <NavbarActiveIndicator />}
      {icon && (
        <Box component="span" sx={{ position: "relative", zIndex: 1, display: "inline-flex" }}>
          <Icon name={icon} size={nested ? "sm" : "md"} />
        </Box>
      )}
      <Box
        component="span"
        sx={{
          flex: 1,
          minWidth: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        {label}
      </Box>
      {trailing && (
        <Box component="span" sx={{ position: "relative", zIndex: 1, display: "inline-flex" }}>
          {trailing}
        </Box>
      )}
    </Box>
  );
}
