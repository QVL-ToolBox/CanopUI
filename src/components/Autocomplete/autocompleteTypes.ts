export interface CanopAutocompleteOption {
  value: string;
  label?: string;
}

export interface CanopAutocompleteProps {
  options: readonly CanopAutocompleteOption[];
  value: string;
  onChange: (value: string) => void;
  inputValue?: string;
  onInputChange?: (text: string) => void;
  label?: string;
  ariaLabel?: string;
  placeholder?: string;
  allowFreeText?: boolean;
  /** @deprecated Sans effet : la suggestion s'affiche en ligne, il n'y a plus de liste. */
  maxSuggestions?: number;
  normalize?: (text: string) => string;
  clearOnSelect?: boolean;
  helperText?: string;
  error?: string | null;
  disabled?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
  size?: "small" | "medium";
}
