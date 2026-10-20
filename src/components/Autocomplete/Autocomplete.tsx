import MuiAutocomplete from "@mui/material/Autocomplete";
import MuiTextField from "@mui/material/TextField";
import type { FilterOptionsState } from "@mui/material/useAutocomplete";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "../../i18n";
import { foldForSearch } from "./foldForSearch";

export interface CanopAutocompleteOption {
  value: string;
  label?: string;
}

export interface CanopAutocompleteProps {
  options: readonly CanopAutocompleteOption[];
  /** Valeur retenue, ou chaîne vide quand rien n'est choisi. */
  value: string;
  onChange: (value: string) => void;
  /** Texte saisi, quand l'appelant veut le tenir lui-même. */
  inputValue?: string;
  onInputChange?: (text: string) => void;
  label?: string;
  /** Nom accessible explicite, pour un champ sans libellé visible. */
  ariaLabel?: string;
  placeholder?: string;
  /**
   * Accepte une saisie qui ne figure pas dans la liste.
   *
   * Par défaut non : une valeur hors liste n'est presque jamais exploitable,
   * et la refuser tout de suite vaut mieux qu'un message d'erreur après coup.
   */
  allowFreeText?: boolean;
  /** Plafond de suggestions affichées. Sans plafond par défaut. */
  maxSuggestions?: number;
  /**
   * Ce qu'on compare, des deux côtés : la saisie et le libellé de chaque
   * option passent par cette fonction avant d'être confrontés.
   *
   * Par défaut `foldForSearch`, qui retire accents, casse et séparateurs. La
   * remplacer permet d'ajouter ce que la librairie ne peut pas deviner — des
   * abréviations d'usage, un préfixe à ignorer, un alias métier :
   * `normalize={(texte) => foldForSearch(texte).replace(/\bst\b/g, "saint")}`.
   */
  normalize?: (text: string) => string;
  /**
   * Vide le champ dès qu'une valeur est retenue.
   *
   * Pour une saisie répétée — une suite d'essais, une liste qu'on remplit —
   * où le texte précédent n'a plus rien à dire.
   */
  clearOnSelect?: boolean;
  helperText?: string;
  error?: string | null;
  disabled?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
  size?: "small" | "medium";
}

type OptionOuSaisieLibre = string | CanopAutocompleteOption;

function labelOf(option: OptionOuSaisieLibre): string {
  return typeof option === "string" ? option : (option.label ?? option.value);
}

function valueOf(option: OptionOuSaisieLibre): string {
  return typeof option === "string" ? option : option.value;
}

function isSameOptionByValueNotIdentity(
  option: OptionOuSaisieLibre,
  current: OptionOuSaisieLibre,
): boolean {
  return valueOf(option) === valueOf(current);
}

/**
 * Un champ de saisie avec suggestions.
 *
 * Il remplace le `<datalist>` qu'on écrit d'instinct, et qui coûte cher : le
 * filtrage y est laissé au navigateur, la navigation au clavier n'existe pas
 * partout, et rien ne rattrape une saisie approchée — l'utilisateur écrit
 * « cote d », le champ ne trouve rien et l'application répond « inconnu »
 * alors que la suggestion était sous ses yeux.
 *
 * Ici la première suggestion est **présélectionnée**, donc Entrée retient ce
 * qui est proposé, et le filtrage ignore accents, casse **et séparateurs** :
 * « cote d or » trouve « Côte-d'Or », ce qu'aucun clavier ne facilite. La
 * prop `normalize` remplace cette règle quand un domaine en demande une autre.
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
  allowFreeText = false,
  maxSuggestions,
  normalize,
  clearOnSelect = false,
  helperText,
  error,
  disabled = false,
  fullWidth = false,
  autoFocus = false,
  size = "medium",
}: CanopAutocompleteProps) {
  const { t } = useTranslation();
  const [uncontrolledInput, setUncontrolledInput] = useState("");
  const text = inputValue ?? uncontrolledInput;

  const updateText = useCallback(
    (next: string) => {
      if (inputValue === undefined) setUncontrolledInput(next);
      onInputChange?.(next);
    },
    [inputValue, onInputChange],
  );

  const filterOptions = useMemo(() => {
    const fold = normalize ?? foldForSearch;
    return (
      list: CanopAutocompleteOption[],
      state: FilterOptionsState<CanopAutocompleteOption>,
    ): CanopAutocompleteOption[] => {
      const query = fold(state.inputValue);
      const kept = query ? list.filter((option) => fold(labelOf(option)).includes(query)) : list;
      return maxSuggestions === undefined ? kept : kept.slice(0, maxSuggestions);
    };
  }, [normalize, maxSuggestions]);

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  return (
    <MuiAutocomplete
      options={options as CanopAutocompleteOption[]}
      value={selected}
      isOptionEqualToValue={isSameOptionByValueNotIdentity}
      getOptionLabel={labelOf}
      filterOptions={filterOptions}
      freeSolo={allowFreeText}
      autoHighlight
      autoComplete
      autoSelect={false}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      inputValue={text}
      onInputChange={(_, next) => updateText(next)}
      onChange={(_, next) => {
        const retenu = typeof next === "string" ? next : (next?.value ?? "");
        onChange(retenu);
        if (clearOnSelect) updateText("");
      }}
      noOptionsText={t("canop.autocomplete.empty")}
      clearText={t("canop.autocomplete.clear")}
      openText={t("canop.autocomplete.open")}
      closeText={t("canop.autocomplete.close")}
      renderInput={(params) => (
        <MuiTextField
          {...params}
          label={label}
          placeholder={placeholder}
          helperText={error ?? helperText}
          error={Boolean(error)}
          autoFocus={autoFocus}
          fullWidth={fullWidth}
          slotProps={{
            ...params.slotProps,
            htmlInput: {
              ...params.slotProps.htmlInput,
              ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
            },
          }}
        />
      )}
    />
  );
}
