import { useCallback, useRef, useState, type RefObject } from "react";

export interface UseMenuAnchorResult<T extends HTMLElement = HTMLButtonElement> {
  open: boolean;
  /** A poser sur l'element qui ouvre le menu : c'est lui qui l'ancre. */
  anchorRef: RefObject<T | null>;
  /** L'element d'ancrage, a passer a `Menu`. */
  anchorEl: T | null;
  openMenu: () => void;
  closeMenu: () => void;
  /**
   * Enveloppe une action d'item : elle ferme le menu **puis** agit.
   *
   * L'ordre compte. Agir d'abord peut demonter l'element qui ancre le menu --
   * supprimer la ligne dont on vient d'ouvrir le menu, par exemple -- et le
   * menu se retrouve alors ancre a un noeud disparu, donc collé dans un coin
   * de l'ecran le temps de sa fermeture.
   */
  withClose: <A extends unknown[]>(action: (...args: A) => void) => (...args: A) => void;
}

/**
 * L'etat d'un menu et son point d'ancrage.
 *
 * Trois lignes d'etat et une reference, que chaque application reecrivait :
 * un `useState` pour l'ouverture, un `useRef` pour l'ancre, et la fermeture a
 * la selection oubliee une fois sur deux.
 */
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
