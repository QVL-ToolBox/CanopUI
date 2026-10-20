import Box from "@mui/material/Box";
import { LayoutGroup } from "framer-motion";
import { useId, type ReactNode } from "react";
import { useTranslation } from "../../i18n";
import { NavbarRailItem } from "./NavbarRailItem";
import { NavbarRailSettings } from "./NavbarRailSettings";
import { NavbarUtilities } from "./NavbarUtilities";
import { useNavbarUtilitiesInset } from "./useNavbarUtilitiesInset";
import { reservePageTopRight } from "../_shared/pageTopRightInset";
import { NAVBAR_SURFACE_GRADIENT } from "./navbarStyles";
import { type CanopNavbarItem } from "./navigation";

export interface NavbarRailProps {
  items: CanopNavbarItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
  userName?: string;
  onLogout?: () => void;
  actions?: ReactNode;
  height: string;
  children: ReactNode;
}

const RAIL_WIDTH = "4.5rem";

export function NavbarRail({
  items,
  activeHref,
  onNavigate,
  userName,
  onLogout,
  actions,
  height,
  children,
}: NavbarRailProps) {
  const { t } = useTranslation();
  const groupId = useId();
  const utilitiesInset = useNavbarUtilitiesInset(Boolean(actions));

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        height: height,
        overflow: "hidden",
        ...reservePageTopRight(utilitiesInset),
      }}
    >
      <Box
        component="nav"
        aria-label={t("canop.navbar.navigation")}
        sx={{
          width: RAIL_WIDTH,
          flexShrink: 0,
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          paddingY: "1.25rem",
          paddingX: "0.5rem",
          color: "primary.contrastText",
          background: NAVBAR_SURFACE_GRADIENT,
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.375rem",
          }}
        >
          <LayoutGroup id={groupId}>
            {items.map((item) => (
              <NavbarRailItem
                key={item.href}
                item={item}
                activeHref={activeHref}
                onNavigate={onNavigate}
              />
            ))}
          </LayoutGroup>
        </Box>

        {(userName || onLogout) && <NavbarRailSettings userName={userName} onLogout={onLogout} />}
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>

      <NavbarUtilities actions={actions} />
    </Box>
  );
}
