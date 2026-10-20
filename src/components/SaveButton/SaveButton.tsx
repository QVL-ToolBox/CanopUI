import { useTranslation } from "../../i18n";
import type { CanopIconSize } from "../Icon";
import { IconActionButton } from "../IconActionButton";
import { Toast } from "../Toast";
import { useSaveButton } from "./useSaveButton";

export interface CanopSaveButtonProps {
  onSave: () => void | Promise<void>;

  successMessage?: string;

  errorMessage?: string;

  disabled?: boolean;

  /** Largeur et hauteur du bouton, en unités CSS relatives (rem). */
  size?: string;

  /** Taille de l'icône affichée dans le bouton. */
  iconSize?: CanopIconSize;

  ariaLabel?: string;
}

export function SaveButton({
  onSave,
  successMessage,
  errorMessage,
  disabled = false,
  size = "2.5rem",
  iconSize,
  ariaLabel,
}: CanopSaveButtonProps) {
  const { t } = useTranslation();
  const { state, save, dismiss } = useSaveButton(onSave);

  return (
    <>
      <IconActionButton
        icon="save"
        variant="default"
        ariaLabel={ariaLabel ?? t("canop.saveButton.label")}
        onClick={() => void save()}
        disabled={disabled}
        loading={state === "saving"}
        size={size}
        iconSize={iconSize}
      />
      <Toast
        open={state === "saved"}
        message={successMessage ?? t("canop.saveButton.success")}
        severity="success"
        onClose={dismiss}
      />
      <Toast
        open={state === "failed"}
        message={errorMessage ?? t("canop.saveButton.error")}
        severity="error"
        onClose={dismiss}
      />
    </>
  );
}
