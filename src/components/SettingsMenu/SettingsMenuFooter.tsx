import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";
import { useTranslation } from "../../i18n";
import { hoverOrKeyboardFocus } from "../../interaction";
import { squircleSurface } from "../../squircle";
import { tokens } from "../../tokens";
import { Icon } from "../Icon";
import { NavbarDivider } from "../Navbar/NavbarDivider";
import { navbarHoverSx } from "../Navbar/navbarInteraction";
import { NAVBAR_TEXT, NAVBAR_TEXT_STRONG } from "../Navbar/navbarTone";
import {
  SETTINGS_BUTTON_RADIUS,
  SETTINGS_ICON_BUTTON_SIZE,
  SETTINGS_LINK_GAP,
} from "./settingsMenuSizes";

export interface SettingsMenuFooterProps {
  footer?: ReactNode;
  infoHref?: string;
  supportHref?: string;
  onNavigate: () => void;
}

const FOOTER_MAX_WIDTH = "14rem";

const linkButtonSx = {
  width: SETTINGS_ICON_BUTTON_SIZE,
  height: SETTINGS_ICON_BUTTON_SIZE,
  ...squircleSurface({ radius: SETTINGS_BUTTON_RADIUS, background: "transparent" }),
  color: NAVBAR_TEXT,
  [hoverOrKeyboardFocus()]: navbarHoverSx,
};

const footerContentSx = {
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  maxWidth: FOOTER_MAX_WIDTH,
  color: NAVBAR_TEXT,
  textAlign: "center",
  ...tokens.typography.app["body-sm"],
  "& a": { color: NAVBAR_TEXT },
  "& a:hover, & a:focus-visible": { color: NAVBAR_TEXT_STRONG },
} as const;

export function SettingsMenuFooter({
  footer,
  infoHref,
  supportHref,
  onNavigate,
}: SettingsMenuFooterProps) {
  const { t } = useTranslation();
  const showLinks = Boolean(infoHref) || Boolean(supportHref);

  return (
    <Stack spacing={tokens.spacing.xs} useFlexGap sx={{ alignSelf: "stretch" }}>
      <NavbarDivider />
      {footer ? (
        <Stack direction="row" spacing={tokens.spacing.xs} useFlexGap sx={footerContentSx}>
          {footer}
        </Stack>
      ) : null}
      {showLinks ? (
        <Stack
          direction="row"
          spacing={SETTINGS_LINK_GAP}
          useFlexGap
          sx={{ justifyContent: "center" }}
        >
          {infoHref ? (
            <IconButton
              component="a"
              href={infoHref}
              onClick={onNavigate}
              aria-label={t("canop.navbar.legalInfo")}
              sx={linkButtonSx}
            >
              <Icon name="info" size="sm" />
            </IconButton>
          ) : null}
          {supportHref ? (
            <IconButton
              component="a"
              href={supportHref}
              onClick={onNavigate}
              aria-label={t("canop.navbar.reportBug")}
              sx={linkButtonSx}
            >
              <Icon name="help" size="sm" />
            </IconButton>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  );
}
