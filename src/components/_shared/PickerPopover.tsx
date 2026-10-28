import Popover from "@mui/material/Popover";
import type { ReactNode } from "react";

export interface PickerPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
}

const PAPER_SX = {
  marginTop: "0.5rem",
  padding: { xs: "0.75rem", sm: "1rem" },
  maxWidth: "calc(100vw - 1.5rem)",
} as const;

export function PickerPopover({ anchorEl, onClose, ariaLabel, children }: PickerPopoverProps) {
  return (
    <Popover
      open={anchorEl !== null}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      slotProps={{ paper: { role: "dialog", "aria-label": ariaLabel, sx: PAPER_SX } }}
    >
      {children}
    </Popover>
  );
}
