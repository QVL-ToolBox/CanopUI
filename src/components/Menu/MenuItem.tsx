import MuiMenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { ReactNode } from "react";

export interface CanopMenuItemProps {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export function MenuItem({ label, icon, onClick, disabled, danger }: CanopMenuItemProps) {
  return (
    <MuiMenuItem
      onClick={onClick}
      disabled={disabled}
      role="menuitem"
      sx={danger ? { color: "error.main" } : undefined}
    >
      {icon && <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>}
      <ListItemText>{label}</ListItemText>
    </MuiMenuItem>
  );
}
