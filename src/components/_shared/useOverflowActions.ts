import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback, useMemo, useState, type MouseEvent } from "react";

export interface UseOverflowActionsResult<T> {
  isCompact: boolean;
  visibleActions: T[];
  overflowActions: T[];
  overflowAnchor: HTMLElement | null;
  overflowOpen: boolean;
  openOverflow: (event: MouseEvent<HTMLElement>) => void;
  closeOverflow: () => void;
}

export function useOverflowActions<T extends { pinned?: boolean }>(
  actions: T[],
): UseOverflowActionsResult<T> {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("sm"));
  const [overflowAnchor, setOverflowAnchor] = useState<HTMLElement | null>(null);

  const { visibleActions, overflowActions } = useMemo(() => {
    if (!isCompact) {
      return { visibleActions: actions, overflowActions: [] as T[] };
    }
    return {
      visibleActions: actions.filter((action) => action.pinned),
      overflowActions: actions.filter((action) => !action.pinned),
    };
  }, [actions, isCompact]);

  const openOverflow = useCallback((event: MouseEvent<HTMLElement>) => {
    setOverflowAnchor(event.currentTarget);
  }, []);

  const closeOverflow = useCallback(() => setOverflowAnchor(null), []);

  return {
    isCompact,
    visibleActions,
    overflowActions,
    overflowAnchor,
    overflowOpen: Boolean(overflowAnchor),
    openOverflow,
    closeOverflow,
  };
}
