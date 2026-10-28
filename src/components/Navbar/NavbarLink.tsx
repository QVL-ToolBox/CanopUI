import Box from "@mui/material/Box";
import type { MouseEvent, ReactNode } from "react";
import { Icon, type CanopIconName } from "../Icon";
import { NavbarActiveIndicator } from "./NavbarActiveIndicator";
import { squircleSurface } from "../../squircle";
import { navbarInteractionSx } from "./navbarInteraction";

export const NAVBAR_LINK_RADIUS = "var(--canop-radius-sm)";

export const NAVBAR_LINK_INSET = "1.125rem";

const LINK_PADDING = `0.5625rem 0.75rem 0.5625rem ${NAVBAR_LINK_INSET}`;
const NESTED_LINK_PADDING = `0.4375rem 0.75rem 0.4375rem ${NAVBAR_LINK_INSET}`;
const LINK_FONT_SIZE = "0.9375rem";

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
        padding: nested ? NESTED_LINK_PADDING : LINK_PADDING,
        ...squircleSurface({ radius: NAVBAR_LINK_RADIUS, background: "transparent" }),
        fontWeight: active ? 600 : 400,
        fontSize: LINK_FONT_SIZE,
        textDecoration: "none",
        cursor: "pointer",
        ...navbarInteractionSx(active, showIndicator),
      }}
    >
      {showIndicator && <NavbarActiveIndicator radius={NAVBAR_LINK_RADIUS} />}
      {icon && (
        <Box component="span" sx={{ position: "relative", zIndex: 1, display: "inline-flex" }}>
          <Icon name={icon} size="sm" variant={active ? "solid" : "outline"} />
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
