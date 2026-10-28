import Tooltip, { type TooltipProps } from "@mui/material/Tooltip";
import { NAVBAR_BG_TOP, NAVBAR_TEXT_STRONG } from "./navbarTone";
import { useNavbarTileTooltip } from "./useNavbarTileTooltip";

export interface NavbarTileTooltipProps {
  label: string;
  placement?: TooltipProps["placement"];
  children: TooltipProps["children"];
}

export function NavbarTileTooltip({ label, placement, children }: NavbarTileTooltipProps) {
  const { enabled, transition } = useNavbarTileTooltip(placement);

  return (
    <Tooltip
      title={enabled ? label : ""}
      placement={placement}
      disableHoverListener={!enabled}
      disableFocusListener={!enabled}
      disableTouchListener={!enabled}
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: NAVBAR_BG_TOP,
            color: NAVBAR_TEXT_STRONG,
            fontSize: "0.8125rem",
            fontWeight: 600,
            paddingY: "0.375rem",
            paddingX: "0.625rem",
          },
        },
        transition,
      }}
    >
      {children}
    </Tooltip>
  );
}
