import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import { useId, useState } from "react";
import { Icon } from "../Icon";
import { logoutButtonSx } from "../_shared/logoutButtonSx";
import { squircleFill, squircleSurface } from "../../squircle";
import { useTranslation } from "../../i18n";
import { NAVBAR_HOVER_OVERLAY } from "./navbarStyles";

export interface NavbarRailSettingsProps {
  userName?: string;
  onLogout?: () => void;
}

export function NavbarRailSettings({ userName, onLogout }: NavbarRailSettingsProps) {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const triggerId = useId();
  const panelId = useId();
  const open = Boolean(anchor);

  function close() {
    setAnchor(null);
  }

  return (
    <>
      <IconButton
        id={triggerId}
        onClick={(event) => setAnchor(event.currentTarget)}
        aria-label={t("canop.navbar.openMenu")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        sx={{
          width: "3rem",
          height: "3rem",
          ...squircleSurface({ radius: "var(--canop-radius-lg)", background: "transparent" }),
          color: "primary.contrastText",
          "&:hover": squircleFill(NAVBAR_HOVER_OVERLAY),
        }}
      >
        <Icon name="settings" size="md" />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{
          paper: {
            id: panelId,
            role: "dialog",
            "aria-labelledby": triggerId,
            sx: {
              marginLeft: "0.5rem",
              ...squircleSurface({
                radius: "var(--canop-radius-lg)",
                background: "var(--canop-palette-surface-overlay)",
                shadow: "var(--canop-drop-shadow-e4)",
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
          {userName && (
            <Box
              sx={{
                fontSize: "0.9rem",
                fontWeight: 600,
                maxWidth: "12rem",
                wordBreak: "break-word",
              }}
            >
              {userName}
            </Box>
          )}
          {onLogout && (
            <IconButton
              onClick={() => {
                close();
                onLogout();
              }}
              aria-label={t("canop.navbar.logout")}
              sx={(theme) => ({
                width: "3rem",
                height: "2.5rem",
                ...logoutButtonSx(theme, "var(--canop-radius-md)"),
              })}
            >
              <Icon name="logout" size="sm" />
            </IconButton>
          )}
        </Box>
      </Popover>
    </>
  );
}
