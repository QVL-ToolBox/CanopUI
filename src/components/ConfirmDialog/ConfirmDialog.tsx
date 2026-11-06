import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";
import { Button } from "../Button";
import { Feedback } from "../Feedback";
import { SkeletonScope } from "../Skeleton/SkeletonScope";

export interface CanopConfirmDialogProps {
  open: boolean;
  title: string;
  message?: ReactNode;
  error?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  error,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: CanopConfirmDialogProps) {
  return (
    <SkeletonScope surface={null}>
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="canop-confirm-dialog-title"
        slotProps={{ paper: { elevation: 0 } }}
      >
        <DialogTitle id="canop-confirm-dialog-title">{title}</DialogTitle>
        {message || error ? (
          <DialogContent>
            <Stack spacing={2}>
              {message ? <DialogContentText>{message}</DialogContentText> : null}
              <Feedback severity="error">{error}</Feedback>
            </Stack>
          </DialogContent>
        ) : null}
        <DialogActions>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </SkeletonScope>
  );
}
