import type { MouseEvent } from "react";
import type { CanopIconName } from "../Icon";

export interface CanopNavbarItem {
  label: string;
  icon?: CanopIconName;
  href: string;
  children?: CanopNavbarItem[];
}

export function isItemActive(itemHref: string, activeHref?: string): boolean {
  if (!activeHref) return false;
  if (itemHref === "/") return activeHref === "/";
  return activeHref === itemHref || activeHref.startsWith(itemHref + "/");
}

export function navigateFromEvent(
  event: MouseEvent,
  href: string,
  onNavigate?: (href: string) => void,
): void {
  if (!onNavigate) return;
  event.preventDefault();
  onNavigate(href);
}
