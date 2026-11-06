import { Input } from "../Input";
import type { CanopAutocompleteProps } from "./autocompleteTypes";
import { useAutocompleteField } from "./useAutocompleteField";

export type { CanopAutocompleteOption, CanopAutocompleteProps } from "./autocompleteTypes";

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
