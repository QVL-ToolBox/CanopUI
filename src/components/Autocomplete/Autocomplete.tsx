import { Input } from "../Input";
import type { CanopAutocompleteProps } from "./autocompleteTypes";
import { useAutocompleteField } from "./useAutocompleteField";

export type { CanopAutocompleteOption, CanopAutocompleteProps } from "./autocompleteTypes";

/**
 * Un champ qui complète la saisie en ligne à partir d'une liste d'options.
 *
 * La suite du libellé de la première option qui prolonge la saisie s'affiche
 * en gris au curseur ; `Tab`, `Entrée`, `→` ou un toucher l'acceptent. La
 * comparaison ignore accents, casse et séparateurs : « cote d » propose
 * « Côte-d'Or ». Une saisie égale à un libellé n'affiche aucune suggestion.
 * `onChange` reçoit la `value` de l'option, dès que la saisie correspond
 * exactement à son libellé.
 *
 * Les libellés doivent être uniques une fois normalisés : deux options
 * homonymes ne se distinguent pas, seule la première est retenue (un
 * avertissement le signale en développement).
 */
export function Autocomplete({
  options,
  value,
  onChange,
  inputValue,
  onInputChange,
  label,
  ariaLabel,
  placeholder,
  allowFreeText,
  normalize,
  clearOnSelect,
  helperText,
  error,
  disabled = false,
  fullWidth = false,
  autoFocus = false,
  size = "medium",
}: CanopAutocompleteProps) {
  const field = useAutocompleteField({
    options,
    value,
    onChange,
    inputValue,
    onInputChange,
    allowFreeText,
    normalize,
    clearOnSelect,
  });

  return (
    <Input
      label={label ?? ""}
      ariaLabel={ariaLabel}
      value={field.text}
      onChange={field.handleTextChange}
      onBlur={field.handleBlur}
      completion={field.suggestions}
      completionNormalize={field.normalize}
      onCompletionAccept={field.handleAccept}
      placeholder={placeholder}
      helperText={helperText}
      error={error}
      disabled={disabled}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      size={size}
    />
  );
}
