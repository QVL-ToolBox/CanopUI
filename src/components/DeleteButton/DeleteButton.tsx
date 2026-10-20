import { useState, type ReactNode } from "react";
import { ConfirmDialog } from "../ConfirmDialog";
import type { CanopIconSize } from "../Icon";
import { IconActionButton } from "../IconActionButton";
import { useTranslation } from "../../i18n";

export interface CanopDeleteButtonProps {
  onConfirm: () => void | Promise<void>;
  ariaLabel: string;

  confirmTitle?: string;

  confirmMessage?: ReactNode;

  confirmLabel?: string;

  cancelLabel?: string;
  disabled?: boolean;
  /** Largeur et hauteur du bouton, en unités CSS relatives (rem). */
  size?: string;
  /** Taille de l'icône affichée dans le bouton. */
  iconSize?: CanopIconSize;
}

export function DeleteButton({
  onConfirm,
  ariaLabel,
  confirmTitle,
  confirmMessage,
  confirmLabel,
  cancelLabel,
  disabled = false,
  size = "2.5rem",
  iconSize,
}: CanopDeleteButtonProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <IconActionButton
        icon="trash"
        variant="danger"
        ariaLabel={ariaLabel}
        disabled={disabled}
        size={size}
        iconSize={iconSize}
        onClick={() => setOpen(true)}
      />
      <ConfirmDialog
        open={open}
        title={confirmTitle ?? t("canop.deleteButton.title")}
        message={confirmMessage}
        confirmLabel={confirmLabel ?? t("canop.deleteButton.confirm")}
        cancelLabel={cancelLabel ?? t("canop.deleteButton.cancel")}
        destructive
        loading={busy}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
