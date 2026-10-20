import { useCallback } from "react";
import type { SnackbarCloseReason } from "@mui/material/Snackbar";

export interface CanopToastAction {
  label: string;

  onClick: () => void;
}

export interface UseToastHandlersResult {
  handleSnackbarClose: (event: unknown, reason: SnackbarCloseReason) => void;
  handleAction: () => void;
}

export function useToastHandlers(
  onClose: () => void,
  action?: CanopToastAction,
): UseToastHandlersResult {
  const handleSnackbarClose = useCallback(
    (_event: unknown, reason: SnackbarCloseReason) => {
      if (reason !== "clickaway") onClose();
    },
    [onClose],
  );

  const onActionClick = action?.onClick;
  const handleAction = useCallback(() => {
    onActionClick?.();
    onClose();
  }, [onActionClick, onClose]);

  return { handleSnackbarClose, handleAction };
}
