import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MuiTextField from "@mui/material/TextField";
import { useState, type Ref } from "react";
import { useTranslation } from "../../i18n";
import { Icon, type CanopIconName } from "../Icon";
import {
  GhostCompletionInput,
  InlineCompletionContext,
  useInlineCompletion,
  type CanopCompletionSource,
} from "../InlineCompletion";
import { LiveRegion } from "../LiveRegion";

export type CanopInputType = "text" | "email" | "password" | "tel" | "url" | "number";
export type CanopInputSize = "small" | "medium";

const COMPLETABLE_TYPES: ReadonlySet<CanopInputType> = new Set(["text", "tel", "url"]);

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
  /**
   * Propose en gris la suite de la saisie : une liste de textes, ou un
   * résolveur (synchrone ou asynchrone) relu à chaque frappe. Changer de
   * résolveur prend effet à la frappe suivante.
   */
  completion?: CanopCompletionSource;
  completionNormalize?: (text: string) => string;
  /**
   * Appelé avec la suggestion entière quand l'utilisateur l'accepte : `Tab`,
   * `Entrée`, `→`, `Ctrl`/`⌥` + `→` sur son dernier mot, ou un toucher sur le
   * texte gris. Une saisie qui finit par égaler une suggestion, lettre à
   * lettre, n'est pas une acceptation.
   */
  onCompletionAccept?: (suggestion: string) => void;
  ariaLabel?: string;
  onBlur?: () => void;
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
  completion,
  completionNormalize,
  onCompletionAccept,
  ariaLabel,
  onBlur,
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
    onBlur?.();
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

  const completable = COMPLETABLE_TYPES.has(type);
  const completesInline = completion !== undefined && completable;
  const inlineCompletion = useInlineCompletion({
    value,
    onChange: handleChange,
    onAccept: onCompletionAccept,
    source: completesInline ? completion : undefined,
    normalize: completionNormalize,
    disabled,
  });

  return (
    <InlineCompletionContext value={inlineCompletion.ghost}>
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
        autoComplete={autoComplete ?? (completesInline ? "off" : undefined)}
        autoFocus={autoFocus}
        size={size}
        inputRef={inputRef}
        slotProps={{
          input: {
            startAdornment,
            endAdornment,
            ...(completable ? { inputComponent: GhostCompletionInput } : undefined),
          },
          htmlInput: {
            ...(completesInline ? inlineCompletion.inputProps : undefined),
            "aria-label": ariaLabel,
          },
        }}
      />
      {completesInline ? <LiveRegion message={inlineCompletion.announcement} /> : null}
    </InlineCompletionContext>
  );
}
