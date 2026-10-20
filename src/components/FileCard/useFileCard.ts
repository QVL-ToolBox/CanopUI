import { useCallback, useState, type MouseEvent } from "react";
import type { CanopIconName } from "../Icon";

export type CanopFileCardKind = "image" | "folder" | "document" | "file";

interface UseFileCardParams {
  kind: CanopFileCardKind;
}

interface UseFileCardResult {
  iconName: CanopIconName;
  menuOpen: boolean;
  menuAnchor: HTMLElement | null;
  openMenu: (event: MouseEvent<HTMLElement>) => void;
  closeMenu: () => void;
  stopPropagation: (event: MouseEvent<HTMLElement>) => void;
}

const iconByKind: Record<CanopFileCardKind, CanopIconName> = {
  image: "image",
  folder: "folder",
  document: "file",
  file: "file",
};

export function useFileCard({ kind }: UseFileCardParams): UseFileCardResult {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const openMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuAnchor(null);
  }, []);

  const stopPropagation = useCallback((event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  }, []);

  return {
    iconName: iconByKind[kind],
    menuOpen: Boolean(menuAnchor),
    menuAnchor,
    openMenu,
    closeMenu,
    stopPropagation,
  };
}
