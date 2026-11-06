import { useState } from "react";

export interface UseDeleteButtonOptions {
  onConfirm: () => void | Promise<void>;
}

export interface UseDeleteButtonResult {
  open: boolean;
  busy: boolean;
  failed: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  confirm: () => void;
}

export function useDeleteButton({ onConfirm }: UseDeleteButtonOptions): UseDeleteButtonResult {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const openDialog = () => {
    setFailed(false);
    setOpen(true);
  };

  const closeDialog = () => setOpen(false);

  const runConfirm = async () => {
    setBusy(true);
    setFailed(false);
    try {
      await onConfirm();
      setOpen(false);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const confirm = () => {
    void runConfirm();
  };

  return { open, busy, failed, openDialog, closeDialog, confirm };
}
