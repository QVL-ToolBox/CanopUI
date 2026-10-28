import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Icon } from "../Icon";
import { useTranslation } from "../../i18n";
import { navbarLogoutSx } from "./navbarLogout";
import { NAVBAR_TEXT_MUTED } from "./navbarTone";

export interface NavbarRailAccountProps {
  userName?: string;
  onLogout?: () => void;
  onClose: () => void;
}

export function NavbarRailAccount({ userName, onLogout, onClose }: NavbarRailAccountProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
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
            color: NAVBAR_TEXT_MUTED,
          }}
        >
          {userName}
        </Box>
      )}
      {onLogout && (
        <IconButton
          onClick={() => {
            onClose();
            onLogout();
          }}
          aria-label={t("canop.navbar.logout")}
          sx={{
            width: "3rem",
            height: "2.5rem",
            ...navbarLogoutSx("var(--canop-radius-md)"),
          }}
        >
          <Icon name="logout" size="sm" />
        </IconButton>
      )}
    </Box>
  );
}
