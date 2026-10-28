import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import type { ReactNode } from "react";
import { SlidingIndicatorGroup } from "../../motion/SlidingIndicatorGroup";
import { Heading } from "../Heading";
import { Icon } from "../Icon";
import { useTranslation } from "../../i18n";
import { NavbarDivider } from "./NavbarDivider";
import { NavbarFootGlow } from "./NavbarFootGlow";
import { NavbarItem } from "./NavbarItem";
import { NAVBAR_LINK_RADIUS } from "./NavbarLink";
import { NavbarUtilities } from "./NavbarUtilities";
import { useNavbarUtilitiesInset } from "./useNavbarUtilitiesInset";
import { reservePageTopRight } from "../_shared/pageTopRightInset";
import { navbarLogoutSx } from "./navbarLogout";
import { navbarPanelSx } from "./navbarSurface";
import { NAVBAR_TEXT, NAVBAR_TEXT_MUTED, NAVBAR_TEXT_STRONG } from "./navbarTone";
import { type CanopNavbarItem } from "./navigation";
import { titleSemantics } from "../_shared/titleLevel";
import { type CanopMainElement } from "../_shared/mainElement";
import { type CanopNavbarTitleLevel } from "./navbarTitle";

export interface NavbarSidebarProps {
  items: CanopNavbarItem[];
  title?: string;
  titleLevel?: CanopNavbarTitleLevel;
  activeHref?: string;
  onNavigate?: (href: string) => void;
  userName?: string;
  onLogout?: () => void;
  sidebarWidget?: ReactNode;
  actions?: ReactNode;
  height: string;
  mainElement: CanopMainElement;
  children: ReactNode;
}

export function NavbarSidebar({
  items,
  title,
  titleLevel = 1,
  activeHref,
  onNavigate,
  userName,
  onLogout,
  sidebarWidget,
  actions,
  height,
  mainElement,
  children,
}: NavbarSidebarProps) {
  const { t } = useTranslation();
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
          width: { md: "15.5rem", lg: "17rem" },
          flexShrink: 0,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1.25rem 1rem",
          color: NAVBAR_TEXT,
          ...navbarPanelSx,
          overflowY: "auto",
        }}
      >
        <NavbarFootGlow />

        {title && (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
            }}
          >
            <Heading
              {...titleSemantics(titleLevel)}
              size={5}
              align="left"
              gutterBottom={false}
              color={NAVBAR_TEXT_STRONG}
            >
              {title}
            </Heading>
            <NavbarDivider />
          </Box>
        )}

        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "0.125rem",
            flex: 1,
          }}
        >
          <SlidingIndicatorGroup>
            {items.map((item) => (
              <NavbarItem
                key={item.href}
                item={item}
                activeHref={activeHref}
                onNavigate={onNavigate}
              />
            ))}
          </SlidingIndicatorGroup>
        </Box>

        {sidebarWidget && (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <NavbarDivider />
            {sidebarWidget}
          </Box>
        )}

        {(userName || onLogout) && (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <NavbarDivider />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {userName && (
                <Box
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    wordBreak: "break-word",
                    color: NAVBAR_TEXT_MUTED,
                  }}
                >
                  {userName}
                </Box>
              )}
              {onLogout && (
                <IconButton
                  onClick={onLogout}
                  aria-label={t("canop.navbar.logout")}
                  sx={{
                    width: "100%",
                    height: "3rem",
                    gap: "0.75rem",
                    paddingX: "0.875rem",
                    justifyContent: "flex-start",
                    ...navbarLogoutSx(NAVBAR_LINK_RADIUS),
                  }}
                >
                  <Icon name="logout" size="sm" />
                  <Box
                    component="span"
                    sx={{
                      fontSize: "0.9375rem",
                    }}
                  >
                    {t("canop.navbar.logout")}
                  </Box>
                </IconButton>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Box
        component={mainElement}
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
