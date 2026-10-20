import Box from "@mui/material/Box";
import { LayoutGroup } from "framer-motion";
import { useId } from "react";
import { useTranslation } from "../../i18n";
import { type CanopNavbarItem } from "./navigation";
import { NavbarMobileItem } from "./NavbarMobileItem";
import { squircleSurface } from "../../squircle";
import { NAVBAR_MOBILE_BAR_OFFSET, NAVBAR_SURFACE_GRADIENT } from "./navbarStyles";

export interface NavbarMobileBarProps {
  items: CanopNavbarItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
}

export function NavbarMobileBar({ items, activeHref, onNavigate }: NavbarMobileBarProps) {
  const { t } = useTranslation();
  const groupId = useId();

  return (
    <Box
      component="nav"
      aria-label={t("canop.navbar.navigation")}
      sx={{
        bottom: NAVBAR_MOBILE_BAR_OFFSET,
        left: "1rem",
        right: "1rem",
        zIndex: (theme) => theme.zIndex.appBar,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.5rem",
        ...squircleSurface({
          radius: "var(--canop-radius-xl)",
          background: NAVBAR_SURFACE_GRADIENT,
          shadow: "var(--canop-drop-shadow-e3)",
          position: "fixed",
        }),
      }}
    >
      <LayoutGroup id={groupId}>
        {items.map((item) => (
          <NavbarMobileItem
            key={item.href}
            item={item}
            activeHref={activeHref}
            onNavigate={onNavigate}
          />
        ))}
      </LayoutGroup>
    </Box>
  );
}
