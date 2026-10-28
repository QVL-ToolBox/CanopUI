import { useState } from "react";
import { NAVBAR_MOBILE_MAX_SLOTS, splitMobileItems } from "./navbarOverflow";
import { isBranchActive, type CanopNavbarItem } from "./navigation";
import { useNavbarBarSlots } from "./useNavbarBarSlots";

export interface UseNavbarMobileOverflowResult {
  barRef: (element: HTMLElement | null) => void;
  visible: CanopNavbarItem[];
  overflow: CanopNavbarItem[];
  overflowActive: boolean;
}

export function useNavbarMobileOverflow(
  items: CanopNavbarItem[],
  activeHref?: string,
): UseNavbarMobileOverflowResult {
  const [bar, setBar] = useState<HTMLElement | null>(null);
  const slots = useNavbarBarSlots(bar);
  const { visible, overflow } = splitMobileItems(items, slots ?? NAVBAR_MOBILE_MAX_SLOTS);
  const overflowActive = overflow.some((item) => isBranchActive(item, activeHref));

  return { barRef: setBar, visible, overflow, overflowActive };
}
