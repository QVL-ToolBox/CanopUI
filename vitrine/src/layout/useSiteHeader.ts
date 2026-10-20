import { useCallback, useState } from "react";

export interface UseSiteHeaderResult {
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

export function useSiteHeader(): UseSiteHeaderResult {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  return { menuOpen, openMenu, closeMenu };
}
