import type { TooltipProps } from "@mui/material/Tooltip";
import { OptionalTooltip } from "../_shared/OptionalTooltip";

export interface NavbarTileTooltipProps {
  label: string;
  placement?: TooltipProps["placement"];
  children: TooltipProps["children"];
}

export function NavbarTileTooltip({ label, placement, children }: NavbarTileTooltipProps) {
  return (
    <OptionalTooltip title={placement ? label : undefined} placement={placement}>
      {children}
    </OptionalTooltip>
  );
}
