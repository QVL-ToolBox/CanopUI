import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import { useId, useState, type ReactNode } from "react";
import { Icon } from "../Icon";
import { LanguageSelector } from "../LanguageSelector";
import { ThemeToggle } from "../ThemeToggle";
import { Divider } from "../Divider";
import { useTranslation } from "../../i18n";
import { logoutButtonSx } from "../_shared/logoutButtonSx";
import {
  NAVBAR_MOBILE_SETTINGS_RIGHT,
  NAVBAR_MOBILE_SETTINGS_SIZE,
  NAVBAR_MOBILE_SETTINGS_TOP,
} from "../Navbar/navbarStyles";
import { squircleFill, squircleSurface } from "../../squircle";

export interface CanopSettingsMenuProps {
  onLogout?: () => void;
  footer?: ReactNode;
  infoHref?: string;
  supportHref?: string;
}

const ICON_BUTTON_SIZE = "2.25rem";
const LINK_GAP = "0.5rem";
const CONTROL_HEIGHT = "2.25rem";

const CONTROL_WIDTH = `calc(2 * ${ICON_BUTTON_SIZE} + ${LINK_GAP})`;

const linkButtonSx = {
  width: ICON_BUTTON_SIZE,
  height: ICON_BUTTON_SIZE,
  ...squircleSurface({ radius: "0.625rem", background: "transparent" }),
  color: "secondary.contrastText",
  "&:hover": squircleFill("var(--canop-palette-action-hover)"),
};

export function SettingsMenu({ onLogout, footer, infoHref, supportHref }: CanopSettingsMenuProps) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const triggerId = useId();
  const panelId = useId();
  const open = Boolean(anchor);
  const showInfo = Boolean(footer && infoHref);

  function closeMenu() {
    setAnchor(null);
  }

  return (
    <>
      <IconButton
        id={triggerId}
        onClick={(e) => setAnchor(e.currentTarget)}
        aria-label={t("canop.navbar.openMenu")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        sx={{
          top: NAVBAR_MOBILE_SETTINGS_TOP,
          right: NAVBAR_MOBILE_SETTINGS_RIGHT,
          zIndex: (theme) => theme.zIndex.appBar + 1,
          width: NAVBAR_MOBILE_SETTINGS_SIZE,
          height: NAVBAR_MOBILE_SETTINGS_SIZE,
          ...squircleSurface({
            radius: "0.625rem",
            background: "var(--canop-palette-primary-main)",
            shadow: "var(--canop-drop-shadow-e2)",
            position: "fixed",
          }),
          color: "primary.contrastText",
          "&:hover": squircleFill("var(--canop-palette-primary-dark)"),
        }}
      >
        <Icon name="settings" size="sm" />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            id: panelId,
            role: "dialog",
            "aria-labelledby": triggerId,
            sx: {
              marginTop: "0.5rem",
              width: "max-content",
              maxWidth: "calc(100% - 2rem)",
              ...squircleSurface({
                radius: "0.75rem",
                background: "var(--canop-palette-secondary-main)",
                position: "absolute",
              }),
            },
          },
        }}
      >
        <Box
          sx={{
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <LanguageSelector width={CONTROL_WIDTH} />
          <ThemeToggle />
          {onLogout && (
            <IconButton
              onClick={() => {
                closeMenu();
                onLogout();
              }}
              aria-label={t("canop.navbar.logout")}
              sx={(theme) => ({
                width: CONTROL_WIDTH,
                height: CONTROL_HEIGHT,
                ...logoutButtonSx(theme, "0.625rem"),
              })}
            >
              <Icon name="logout" size="sm" />
            </IconButton>
          )}
          {(showInfo || supportHref) && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                alignSelf: "stretch",
              }}
            >
              <Divider spacing="none" />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: LINK_GAP,
                }}
              >
                {showInfo && (
                  <IconButton
                    component="a"
                    href={infoHref}
                    onClick={closeMenu}
                    aria-label={t("canop.navbar.legalInfo")}
                    sx={linkButtonSx}
                  >
                    <Icon name="info" size="sm" />
                  </IconButton>
                )}
                {supportHref && (
                  <IconButton
                    component="a"
                    href={supportHref}
                    onClick={closeMenu}
                    aria-label={t("canop.navbar.reportBug")}
                    sx={linkButtonSx}
                  >
                    <Icon name="help" size="sm" />
                  </IconButton>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
}
