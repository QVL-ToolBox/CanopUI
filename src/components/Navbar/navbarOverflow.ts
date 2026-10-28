import { hasSubItems, type CanopNavbarItem } from "./navigation";

export const NAVBAR_MOBILE_MAX_SLOTS = 5;

export const NAVBAR_MOBILE_BAR_GAP = "0.25rem";

export interface NavbarMobileSplit {
  visible: CanopNavbarItem[];
  overflow: CanopNavbarItem[];
}

export interface NavbarBarMetrics {
  contentWidth: number;
  tileWidth: number;
  gap: number;
}

export function mobileBarSlots({ contentWidth, tileWidth, gap }: NavbarBarMetrics): number {
  const fitting = Math.floor((contentWidth + gap) / (tileWidth + gap));
  return Math.max(1, Math.min(NAVBAR_MOBILE_MAX_SLOTS, fitting));
}

export function splitMobileItems(items: CanopNavbarItem[], slots: number): NavbarMobileSplit {
  if (items.length <= slots) return { visible: items, overflow: [] };
  const kept = slots - 1;
  return { visible: items.slice(0, kept), overflow: items.slice(kept) };
}

export function separatesOverflowEntry(items: CanopNavbarItem[], index: number): boolean {
  if (index === 0) return false;
  return hasSubItems(items[index]) || hasSubItems(items[index - 1]);
}
