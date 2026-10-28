import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import { useId, type ReactNode } from "react";
import { Icon } from "../Icon";
import { squircleSurface } from "../../squircle";
import { hoverOrKeyboardFocus } from "../../interaction";
import { useTranslation } from "../../i18n";
import { NavbarDivider } from "./NavbarDivider";
import { NavbarRailAccount } from "./NavbarRailAccount";
import { NavbarTileTooltip } from "./NavbarTileTooltip";
import { navbarHoverSx } from "./navbarInteraction";
import { navbarPopoverSurfaceSx } from "./navbarSurface";
import { NAVBAR_TILE_RADIUS } from "./navbarTile";
import { NAVBAR_TEXT } from "./navbarTone";
import { useNavbarPopover } from "./useNavbarPopover";

const RAIL_WIDGET_WIDTH = "13.5rem";

export interface NavbarRailSettingsProps {
  userName?: string;
  onLogout?: () => void;
  widget?: ReactNode;
}

export function NavbarRailSettings({ userName, onLogout, widget }: NavbarRailSettingsProps) {
  const { t } = useTranslation();
  const popover = useNavbarPopover();
  const triggerId = useId();
  const hasAccount = Boolean(userName || onLogout);

  return (
    <>
      <NavbarTileTooltip label={t("canop.navbar.openMenu")} placement="right">
        <IconButton
          id={triggerId}
          onClick={popover.openFrom}
          aria-label={t("canop.navbar.openMenu")}
          aria-haspopup="dialog"
          aria-expanded={popover.open}
          aria-controls={popover.open ? popover.panelId : undefined}
          sx={{
            width: "3rem",
            height: "3rem",
            ...squircleSurface({ radius: NAVBAR_TILE_RADIUS, background: "transparent" }),
            color: NAVBAR_TEXT,
            [hoverOrKeyboardFocus()]: navbarHoverSx,
          }}
        >
          <Icon name="settings" size="md" />
        </IconButton>
      </NavbarTileTooltip>

      <Popover
        open={popover.open}
        anchorEl={popover.anchor}
        onClose={popover.close}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: {
            id: popover.panelId,
            role: "dialog",
            "aria-labelledby": triggerId,
            sx: {
              marginLeft: "0.5rem",
              ...navbarPopoverSurfaceSx(NAVBAR_TILE_RADIUS),
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
            color: NAVBAR_TEXT,
          }}
        >
          {widget && (
            <Box
              sx={{
                width: RAIL_WIDGET_WIDTH,
                maxWidth: "100%",
              }}
            >
              {widget}
            </Box>
          )}
          {widget && hasAccount && <NavbarDivider />}
          {hasAccount && (
            <NavbarRailAccount userName={userName} onLogout={onLogout} onClose={popover.close} />
          )}
        </Box>
      </Popover>
    </>
  );
}
