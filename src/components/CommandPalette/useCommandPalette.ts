import { useCallback, useEffect, useState } from "react";

export interface UseCommandPaletteOptions {
  shortcut?: boolean;
}

export interface UseCommandPaletteResult {
  open: boolean;
  setOpen: (value: boolean) => void;
  toggle: () => void;
  close: () => void;
}

export function useCommandPalette({
  shortcut = true,
}: UseCommandPaletteOptions = {}): UseCommandPaletteResult {
  const [open, setOpenState] = useState(false);

  const setOpen = useCallback((value: boolean) => setOpenState(value), []);
  const toggle = useCallback(() => setOpenState((current) => !current), []);
  const close = useCallback(() => setOpenState(false), []);

  useEffect(() => {
    if (!shortcut) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === "k" || event.key === "K")) {
        event.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shortcut, toggle]);

  return { open, setOpen, toggle, close };
}
