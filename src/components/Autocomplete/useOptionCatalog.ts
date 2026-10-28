import { useEffect, useMemo } from "react";
import type { CanopAutocompleteOption } from "./autocompleteTypes";

export interface OptionCatalog {
  labels: readonly string[];
  labelOfValue: (value: string) => string | undefined;
  optionMatching: (text: string) => CanopAutocompleteOption | undefined;
  isExtendedByAnotherLabel: (text: string) => boolean;
}

interface IndexedOptions {
  catalog: OptionCatalog;
  duplicateLabels: readonly string[];
}

function labelOf(option: CanopAutocompleteOption): string {
  return option.label ?? option.value;
}

function indexOptions(
  options: readonly CanopAutocompleteOption[],
  normalize: (text: string) => string,
): IndexedOptions {
  const optionByKey = new Map<string, CanopAutocompleteOption>();
  const labelByValue = new Map<string, string>();
  const duplicateLabels: string[] = [];
  options.forEach((option) => {
    const label = labelOf(option);
    const key = normalize(label);
    if (optionByKey.has(key)) duplicateLabels.push(label);
    else optionByKey.set(key, option);
    if (!labelByValue.has(option.value)) labelByValue.set(option.value, label);
  });
  const keys = [...optionByKey.keys()];

  return {
    duplicateLabels,
    catalog: {
      labels: options.map(labelOf),
      labelOfValue: (value) => labelByValue.get(value),
      optionMatching: (text) => {
        const key = normalize(text);
        return key === "" ? undefined : optionByKey.get(key);
      },
      isExtendedByAnotherLabel: (text) => {
        const key = normalize(text);
        return keys.some((other) => other !== key && other.startsWith(key));
      },
    },
  };
}

function useDuplicateLabelWarning(duplicateLabels: readonly string[]): void {
  const duplicates = duplicateLabels.join(", ");

  useEffect(() => {
    if (!import.meta.env.DEV || duplicates === "") return;
    console.warn(
      `[@canop/ui] Autocomplete : libellés en double une fois normalisés, seule la première option est retenue : ${duplicates}.`,
    );
  }, [duplicates]);
}

export function useOptionCatalog(
  options: readonly CanopAutocompleteOption[],
  normalize: (text: string) => string,
): OptionCatalog {
  const { catalog, duplicateLabels } = useMemo(
    () => indexOptions(options, normalize),
    [options, normalize],
  );
  useDuplicateLabelWarning(duplicateLabels);
  return catalog;
}
