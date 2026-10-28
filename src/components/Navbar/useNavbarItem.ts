import { useId, useState, type MouseEvent } from "react";
import {
  isItemActive,
  isSubItemActive,
  navbarSections,
  navigateFromEvent,
  type CanopNavbarItem,
  type NavbarSection,
} from "./navigation";

export interface UseNavbarItemResult {
  sections: NavbarSection[];
  hasSubItems: boolean;
  active: boolean;
  childActive: boolean;
  expanded: boolean;
  subListId: string;
  handleParentClick: (event: MouseEvent) => void;
}

export function useNavbarItem(
  item: CanopNavbarItem,
  activeHref?: string,
  onNavigate?: (href: string) => void,
): UseNavbarItemResult {
  const sections = navbarSections(item);
  const hasSubItems = sections.length > 0;
  const subListId = useId();
  const childActive = isSubItemActive(item, activeHref);
  const active = isItemActive(item.href, activeHref) || childActive;

  const [open, setOpen] = useState(active);
  const [syncedActive, setSyncedActive] = useState(active);
  if (active !== syncedActive) {
    setSyncedActive(active);
    setOpen(active);
  }

  function handleParentClick(event: MouseEvent) {
    navigateFromEvent(event, item.href, onNavigate);
    if (hasSubItems) {
      setOpen((value) => !value);
    }
  }

  return {
    sections,
    hasSubItems,
    active,
    childActive,
    expanded: hasSubItems && open,
    subListId,
    handleParentClick,
  };
}
