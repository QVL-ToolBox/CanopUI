import { useCallback, useRef, useState, type RefObject } from "react";

export interface UsePickerPopoverResult {
  fieldRef: RefObject<HTMLDivElement | null>;
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export function usePickerPopover(disabled: boolean): UsePickerPopoverResult {
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = useCallback(() => {
    if (disabled) return;
    setAnchorEl(fieldRef.current);
  }, [disabled]);

  const close = useCallback(() => setAnchorEl(null), []);

  return { fieldRef, anchorEl, isOpen: anchorEl !== null, open, close };
}
