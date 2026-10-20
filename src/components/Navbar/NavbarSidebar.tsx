import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { LayoutGroup } from "framer-motion";
import { useId, type ReactNode } from "react";
import { Heading } from "../Heading";
import { Icon } from "../Icon";
import { Separator } from "../Separator";
import { logoutButtonSx } from "../_shared/logoutButtonSx";
import { useTranslation } from "../../i18n";
import { NavbarItem } from "./NavbarItem";
import { NavbarUtilities } from "./NavbarUtilities";
import { useNavbarUtilitiesInset } from "./useNavbarUtilitiesInset";
import { reservePageTopRight } from "../_shared/pageTopRightInset";
import { NAVBAR_FOOT_GLOW, NAVBAR_SURFACE_GRADIENT } from "./navbarStyles";
import { type CanopNavbarItem } from "./navigation";
import { navbarTitleSemantics, type CanopNavbarTitleLevel } from "./navbarTitle";

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
  children,
}: NavbarSidebarProps) {
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
          width: { md: "15.5rem", lg: "17rem" },
          flexShrink: 0,
          height: "100%",
          boxSizing: "border-box",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1.25rem 1rem",
          color: "primary.contrastText",
          background: NAVBAR_SURFACE_GRADIENT,
          overflowY: "auto",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "10rem",
            pointerEvents: "none",
            background: NAVBAR_FOOT_GLOW,
          }}
        />

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
              {...navbarTitleSemantics(titleLevel)}
              size={4}
              align="center"
              gutterBottom={false}
              color="primary.contrastText"
            >
              {title}
            </Heading>
            <Separator variant="normal" />
          </Box>
        )}

        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: "0.375rem",
            flex: 1,
          }}
        >
          <LayoutGroup id={groupId}>
            {items.map((item) => (
              <NavbarItem
                key={item.href}
                item={item}
                activeHref={activeHref}
                onNavigate={onNavigate}
              />
            ))}
          </LayoutGroup>
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
            <Separator variant="normal" />
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
            <Separator variant="normal" />
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
                  }}
                >
                  {userName}
                </Box>
              )}
              {onLogout && (
                <IconButton
                  onClick={onLogout}
                  aria-label={t("canop.navbar.logout")}
                  sx={(theme) => ({
                    width: "100%",
                    height: "3rem",
                    gap: "0.75rem",
                    paddingX: "0.875rem",
                    ...logoutButtonSx(theme, "var(--canop-radius-md)"),
                  })}
                >
                  <Icon name="logout" size="md" />
                  <Box
                    component="span"
                    sx={{
                      fontSize: "1rem",
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
