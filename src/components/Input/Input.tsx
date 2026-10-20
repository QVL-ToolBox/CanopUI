import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MuiTextField from "@mui/material/TextField";
import { useState, type Ref } from "react";
import { useTranslation } from "../../i18n";
import { Icon, type CanopIconName } from "../Icon";

export type CanopInputType = "text" | "email" | "password" | "tel" | "url" | "number";
export type CanopInputSize = "small" | "medium";

export interface CanopInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: CanopInputType;
  name?: string;
  placeholder?: string;
  helperText?: string;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  size?: CanopInputSize;
  /**
   * Une référence sur le champ natif, pour lui rendre le focus sans le
   * remonter.
   *
   * `autoFocus` ne joue qu'au montage : reprendre la main sur un champ déjà
   * présent — après chaque question d'un quiz, après une erreur de saisie —
   * obligeait à poser une `key` changeante, donc à **détruire et reconstruire**
   * le champ. Le focus revient, mais avec lui l'animation d'entrée du libellé,
   * la perte de l'état de validation locale et une transition qui n'a aucune
   * raison d'être rejouée.
   */
  inputRef?: Ref<HTMLInputElement>;
  icon?: CanopIconName;
  pattern?: RegExp;
  patternMessage?: string;
  validate?: (value: string) => string | null;
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  name,
  placeholder,
  helperText,
  error,
  required = false,
  disabled = false,
  fullWidth = true,
  autoComplete,
  autoFocus = false,
  size = "medium",
  inputRef,
  icon,
  pattern,
  patternMessage,
  validate,
}: CanopInputProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;
  const shownError = error ?? localError;

  const effectiveValidate =
    validate ??
    (pattern
      ? (input: string): string | null => {
          if (required && input.trim() === "") return t("canop.validation.required");
          if (input !== "" && !pattern.test(input)) {
            return patternMessage ?? t("canop.validation.pattern");
          }
          return null;
        }
      : undefined);

  const handleChange = (next: string) => {
    onChange(next);
    if (localError !== null && effectiveValidate) {
      setLocalError(effectiveValidate(next));
    }
  };

  const handleBlur = () => {
    if (effectiveValidate) {
      setLocalError(effectiveValidate(value));
    }
  };

  const startAdornment = icon ? (
    <InputAdornment position="start">
      <Icon name={icon} variant="outline" size="sm" color="primary" />
    </InputAdornment>
  ) : undefined;

  const endAdornment = isPassword ? (
    <InputAdornment position="end">
      <IconButton
        aria-label={showPassword ? t("canop.input.hidePassword") : t("canop.input.showPassword")}
        onClick={() => setShowPassword((visible) => !visible)}
        edge="end"
        size="small"
      >
        <Icon name={showPassword ? "eyeOff" : "eye"} variant="outline" size="sm" color="primary" />
      </IconButton>
    </InputAdornment>
  ) : undefined;

  return (
    <MuiTextField
      label={label}
      value={value}
      onChange={(event) => handleChange(event.target.value)}
      onBlur={handleBlur}
      type={resolvedType}
      name={name}
      placeholder={placeholder}
      helperText={shownError ?? helperText}
      error={Boolean(shownError)}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      size={size}
      inputRef={inputRef}
      slotProps={{ input: { startAdornment, endAdornment } }}
    />
  );
}
