import { useCallback, useId, useState, type MouseEvent } from "react";
import { navigateFromEvent } from "./navigation";

export interface UseNavbarPopoverResult {
  anchor: HTMLElement | null;
  open: boolean;
  panelId: string;
  openFrom: (event: MouseEvent<HTMLElement>) => void;
  close: () => void;
  select: (href: string, event: MouseEvent) => void;
}

export function useNavbarPopover(onNavigate?: (href: string) => void): UseNavbarPopoverResult {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const panelId = useId();

  const openFrom = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  }, []);

  const close = useCallback(() => setAnchor(null), []);

  const select = useCallback(
    (href: string, event: MouseEvent) => {
      navigateFromEvent(event, href, onNavigate);
      setAnchor(null);
    },
    [onNavigate],
  );

  return { anchor, open: anchor !== null, panelId, openFrom, close, select };
}
