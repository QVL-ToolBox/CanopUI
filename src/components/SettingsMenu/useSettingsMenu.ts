import { useId, type ReactNode } from "react";
import { useNavbarPopover, type UseNavbarPopoverResult } from "../Navbar/useNavbarPopover";

export interface UseSettingsMenuParams {
  footer?: ReactNode;
  infoHref?: string;
  supportHref?: string;
}

export interface UseSettingsMenuResult {
  popover: UseNavbarPopoverResult;
  triggerId: string;
  infoLink: string | undefined;
  showFooter: boolean;
}

export function useSettingsMenu({
  footer,
  infoHref,
  supportHref,
}: UseSettingsMenuParams): UseSettingsMenuResult {
  const popover = useNavbarPopover();
  const triggerId = useId();

  return {
    popover,
    triggerId,
    infoLink: footer ? infoHref : undefined,
    showFooter: Boolean(footer) || Boolean(supportHref),
  };
}
