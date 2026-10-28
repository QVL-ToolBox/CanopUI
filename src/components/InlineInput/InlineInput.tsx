import InputBase from "@mui/material/InputBase";
import { squircleClip, squircleRingPath } from "../../squircle";
import { useInlineInput } from "./useInlineInput";

export interface CanopInlineInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Appele a la validation : touche Entree, ou perte du focus. */
  onCommit: () => void;
  /** Appele a l'abandon : touche Echap. */
  onCancel: () => void;
  placeholder?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
  maxLength?: number;
  disabled?: boolean;
}

/**
 * Le champ d'edition **en place** : renommer un fichier dans sa liste, une
 * colonne dans son en-tete, sans ouvrir de formulaire.
 *
 * Il n'apporte pas seulement une apparence discrete, il porte le
 * **comportement** : Entree valide, Echap abandonne, la perte du focus valide,
 * et les evenements ne remontent pas a l'element cliquable qui l'heberge.
 * C'est cette logique-la qui etait recopiee a la main dans les portails, et
 * qu'on oublie a moitie -- l'arret de propagation surtout, dont l'absence ne
 * se voit qu'a l'usage.
 *
 * Pour un champ de formulaire ordinaire, avec libelle et message d'erreur,
 * utiliser `Input`.
 */
export function InlineInput({
  value,
  onChange,
  onCommit,
  onCancel,
  placeholder,
  ariaLabel,
  autoFocus = true,
  maxLength,
  disabled = false,
}: CanopInlineInputProps) {
  const { handleKeyDown, handleClick } = useInlineInput({ onCommit, onCancel });

  return (
    <InputBase
      autoFocus={autoFocus}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      inputProps={{ "aria-label": ariaLabel, maxLength }}
      onChange={(event) => onChange(event.target.value)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onBlur={onCommit}
      sx={{
        ...squircleClip("var(--canop-radius-xs)"),
        position: "relative",
        flex: 1,
        minWidth: "8rem",
        paddingX: "var(--canop-spacing-xs)",
        paddingY: "var(--canop-spacing-3xs)",
        color: "text.primary",
        backgroundColor: "background.paper",
        "--canop-input-autofill": "var(--canop-palette-background-paper)",
        font: "inherit",
        "& .MuiInputBase-input": { padding: 0 },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          clipPath: squircleRingPath("var(--canop-radius-xs)", "0.0625rem"),
          backgroundColor: "var(--canop-palette-primary-main)",
        },
      }}
    />
  );
}
