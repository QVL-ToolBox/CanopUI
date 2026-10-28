import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";
import { Icon } from "../Icon";
import { LanguageSelector } from "../LanguageSelector";
import { ThemeToggle } from "../ThemeToggle";
import { SkeletonScope } from "../Skeleton/SkeletonScope";
import { useTranslation } from "../../i18n";
import { navbarControlsSx } from "../Navbar/navbarControls";
import { navbarLogoutSx } from "../Navbar/navbarLogout";
import {
  NAVBAR_MOBILE_SETTINGS_RIGHT,
  NAVBAR_MOBILE_SETTINGS_SIZE,
  NAVBAR_MOBILE_SETTINGS_TOP,
} from "../Navbar/navbarStyles";
import { navbarPopoverSurfaceSx } from "../Navbar/navbarSurface";
import {
  NAVBAR_HOVER_FILL,
  NAVBAR_SURFACE,
  NAVBAR_TEXT,
  NAVBAR_TEXT_STRONG,
} from "../Navbar/navbarTone";
import { squircleFill, squircleSurface } from "../../squircle";
import { hoverOrKeyboardFocus } from "../../interaction";
import { tokens } from "../../tokens";
import { SettingsMenuFooter } from "./SettingsMenuFooter";
import {
  SETTINGS_BUTTON_RADIUS,
  SETTINGS_CONTROL_HEIGHT,
  SETTINGS_CONTROL_WIDTH,
} from "./settingsMenuSizes";
import { useSettingsMenu } from "./useSettingsMenu";

export interface CanopSettingsMenuProps {
  onLogout?: () => void;
  footer?: ReactNode;
  infoHref?: string;
  supportHref?: string;
}

const TRIGGER_ENGAGED_SURFACE = `linear-gradient(${NAVBAR_HOVER_FILL}, ${NAVBAR_HOVER_FILL}), ${NAVBAR_SURFACE}`;

export function SettingsMenu({ onLogout, footer, infoHref, supportHref }: CanopSettingsMenuProps) {
  const { t } = useTranslation();
  const { popover, triggerId, infoLink, showFooter } = useSettingsMenu({
    footer,
    infoHref,
    supportHref,
  });

  return (
    <>
      <IconButton
        id={triggerId}
        onClick={popover.openFrom}
        aria-label={t("canop.navbar.openMenu")}
        aria-haspopup="dialog"
        aria-expanded={popover.open}
        aria-controls={popover.open ? popover.panelId : undefined}
        sx={{
          top: NAVBAR_MOBILE_SETTINGS_TOP,
          right: NAVBAR_MOBILE_SETTINGS_RIGHT,
          zIndex: (theme) => theme.zIndex.appBar + 1,
          width: NAVBAR_MOBILE_SETTINGS_SIZE,
          height: NAVBAR_MOBILE_SETTINGS_SIZE,
          ...squircleSurface({
            radius: SETTINGS_BUTTON_RADIUS,
            background: NAVBAR_SURFACE,
            shadow: "var(--canop-drop-shadow-e2)",
            position: "fixed",
          }),
          color: NAVBAR_TEXT,
          [hoverOrKeyboardFocus()]: {
            ...squircleFill(TRIGGER_ENGAGED_SURFACE),
            color: NAVBAR_TEXT_STRONG,
          },
        }}
      >
        <Icon name="settings" size="sm" />
      </IconButton>

      <SkeletonScope surface={null}>
        <Popover
          open={popover.open}
          anchorEl={popover.anchor}
          onClose={popover.close}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              id: popover.panelId,
              role: "dialog",
              "aria-labelledby": triggerId,
              sx: {
                marginTop: "0.5rem",
                width: "max-content",
                maxWidth: "calc(100% - 2rem)",
                ...navbarPopoverSurfaceSx("0.75rem"),
              },
            },
          }}
        >
          <Stack
            spacing={tokens.spacing.sm}
            useFlexGap
            sx={{
              padding: "1rem",
              alignItems: "center",
              color: NAVBAR_TEXT,
              ...navbarControlsSx(NAVBAR_HOVER_FILL),
            }}
          >
            <LanguageSelector width={SETTINGS_CONTROL_WIDTH} />
            <ThemeToggle />
            {onLogout ? (
              <IconButton
                onClick={() => {
                  popover.close();
                  onLogout();
                }}
                aria-label={t("canop.navbar.logout")}
                sx={{
                  width: SETTINGS_CONTROL_WIDTH,
                  height: SETTINGS_CONTROL_HEIGHT,
                  ...navbarLogoutSx(SETTINGS_BUTTON_RADIUS),
                }}
              >
                <Icon name="logout" size="sm" />
              </IconButton>
            ) : null}
            {showFooter ? (
              <SettingsMenuFooter
                footer={footer}
                infoHref={infoLink}
                supportHref={supportHref}
                onNavigate={popover.close}
              />
            ) : null}
          </Stack>
        </Popover>
      </SkeletonScope>
    </>
  );
}
