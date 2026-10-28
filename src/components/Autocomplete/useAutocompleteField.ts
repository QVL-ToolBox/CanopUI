import { foldForSearch } from "../_shared/foldText";
import type { CanopAutocompleteOption, CanopAutocompleteProps } from "./autocompleteTypes";
import { useControllableText } from "./useControllableText";
import { useOptionCatalog } from "./useOptionCatalog";
import { useTextFollowsValue } from "./useTextFollowsValue";

export type UseAutocompleteFieldOptions = Pick<
  CanopAutocompleteProps,
  | "options"
  | "value"
  | "onChange"
  | "inputValue"
  | "onInputChange"
  | "allowFreeText"
  | "normalize"
  | "clearOnSelect"
>;

export interface AutocompleteField {
  text: string;
  suggestions: readonly string[];
  normalize: (text: string) => string;
  handleTextChange: (next: string) => void;
  handleAccept: (suggestion: string) => void;
  handleBlur: () => void;
}

export function useAutocompleteField({
  options,
  value,
  onChange,
  inputValue,
  onInputChange,
  allowFreeText = false,
  normalize = foldForSearch,
  clearOnSelect = false,
}: UseAutocompleteFieldOptions): AutocompleteField {
  const catalog = useOptionCatalog(options, normalize);

  const shownTextOf = (retained: string): string => {
    if (clearOnSelect) return "";
    return catalog.labelOfValue(retained) ?? (allowFreeText ? retained : "");
  };

  const valueOfText = (typed: string): string =>
    catalog.optionMatching(typed)?.value ?? (allowFreeText ? typed : "");

  const { text, updateText } = useControllableText(inputValue, onInputChange, () =>
    shownTextOf(value),
  );
  useTextFollowsValue(value, shownTextOf(value), valueOfText(text), updateText);

  const retainWhileTyping = (next: string) => {
    updateText(next);
    const nextValue = valueOfText(next);
    if (nextValue !== value) onChange(nextValue);
  };

  const retainAndClear = (option: CanopAutocompleteOption) => {
    onChange(option.value);
    updateText("");
  };

  const retainUnambiguousEntry = (next: string) => {
    const option = catalog.optionMatching(next);
    if (option === undefined || catalog.isExtendedByAnotherLabel(next)) updateText(next);
    else retainAndClear(option);
  };

  const retainAcceptedAmbiguousLabel = (suggestion: string) => {
    const option = catalog.optionMatching(suggestion);
    if (option !== undefined && catalog.isExtendedByAnotherLabel(suggestion)) {
      retainAndClear(option);
    }
  };

  const retainExactEntryOnLeave = () => {
    const option = catalog.optionMatching(text);
    if (option !== undefined) retainAndClear(option);
    else if (!allowFreeText) updateText("");
  };

  return {
    text,
    suggestions: catalog.labels,
    normalize,
    handleTextChange: clearOnSelect ? retainUnambiguousEntry : retainWhileTyping,
    handleAccept: (suggestion) => {
      if (clearOnSelect) retainAcceptedAmbiguousLabel(suggestion);
    },
    handleBlur: () => {
      if (clearOnSelect) retainExactEntryOnLeave();
      else if (!allowFreeText) updateText(shownTextOf(value));
    },
  };
}
