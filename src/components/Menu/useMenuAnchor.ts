import { useCallback, useRef, useState, type RefObject } from "react";

export interface UseMenuAnchorResult<T extends HTMLElement = HTMLButtonElement> {
  open: boolean;
  anchorRef: RefObject<T | null>;
  anchorEl: T | null;
  openMenu: () => void;
  closeMenu: () => void;
  withClose: <A extends unknown[]>(action: (...args: A) => void) => (...args: A) => void;
}

export function useMenuAnchor<T extends HTMLElement = HTMLButtonElement>(): UseMenuAnchorResult<T> {
  const anchorRef = useRef<T | null>(null);
  const [open, setOpen] = useState(false);

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  const withClose = useCallback(
    <A extends unknown[]>(action: (...args: A) => void) =>
      (...args: A) => {
        setOpen(false);
        action(...args);
      },
    [],
  );

  return {
    open,
    anchorRef,
    anchorEl: open ? anchorRef.current : null,
    openMenu,
    closeMenu,
    withClose,
  };
}
