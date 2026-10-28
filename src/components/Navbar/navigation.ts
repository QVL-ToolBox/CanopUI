import type { MouseEvent } from "react";
import type { CanopIconName } from "../Icon";

export interface CanopNavbarGroup {
  label: string;
  items: CanopNavbarItem[];
}

export interface CanopNavbarItem {
  label: string;
  icon?: CanopIconName;
  href: string;
  children?: CanopNavbarItem[];
  groups?: CanopNavbarGroup[];
}

export interface NavbarSection {
  label?: string;
  items: CanopNavbarItem[];
}

export function isItemActive(itemHref: string, activeHref?: string): boolean {
  if (!activeHref) return false;
  if (itemHref === "/") return activeHref === "/";
  return activeHref === itemHref || activeHref.startsWith(itemHref + "/");
}

export function navbarSections(item: CanopNavbarItem): NavbarSection[] {
  const looseItems = item.children ?? [];
  const groups = (item.groups ?? []).filter((group) => group.items.length > 0);
  return looseItems.length > 0 ? [{ items: looseItems }, ...groups] : groups;
}

export function navbarSubItems(item: CanopNavbarItem): CanopNavbarItem[] {
  return navbarSections(item).flatMap((section) => section.items);
}

export function hasSubItems(item: CanopNavbarItem): boolean {
  return navbarSubItems(item).length > 0;
}

export function isSubItemActive(item: CanopNavbarItem, activeHref?: string): boolean {
  return navbarSubItems(item).some((sub) => isItemActive(sub.href, activeHref));
}

export function isBranchActive(item: CanopNavbarItem, activeHref?: string): boolean {
  return isItemActive(item.href, activeHref) || isSubItemActive(item, activeHref);
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
