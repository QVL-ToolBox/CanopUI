import type { ReactNode } from "react";
import { ConfirmDialog } from "../ConfirmDialog";
import type { CanopIconSize } from "../Icon";
import { IconActionButton } from "../IconActionButton";
import { useTranslation } from "../../i18n";
import { useDeleteButton } from "./useDeleteButton";

export interface CanopDeleteButtonProps {
  onConfirm: () => void | Promise<void>;
  ariaLabel: string;
  confirmTitle?: string;
  confirmMessage?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  errorMessage?: string;
  disabled?: boolean;
  size?: string;
  iconSize?: CanopIconSize;
}

export function DeleteButton({
  onConfirm,
  ariaLabel,
  confirmTitle,
  confirmMessage,
  confirmLabel,
  cancelLabel,
  errorMessage,
  disabled = false,
  size = "2.5rem",
  iconSize,
}: CanopDeleteButtonProps) {
  const { t } = useTranslation();
  const { open, busy, failed, openDialog, closeDialog, confirm } = useDeleteButton({ onConfirm });

  return (
    <>
      <IconActionButton
        icon="trash"
        variant="danger"
        ariaLabel={ariaLabel}
        disabled={disabled}
        size={size}
        iconSize={iconSize}
        onClick={openDialog}
      />
      <ConfirmDialog
        open={open}
        title={confirmTitle ?? t("canop.deleteButton.title")}
        message={confirmMessage}
        error={failed ? (errorMessage ?? t("canop.deleteButton.error")) : null}
        confirmLabel={confirmLabel ?? t("canop.deleteButton.confirm")}
        cancelLabel={cancelLabel ?? t("canop.deleteButton.cancel")}
        destructive
        loading={busy}
        onConfirm={confirm}
        onCancel={closeDialog}
      />
    </>
  );
}
