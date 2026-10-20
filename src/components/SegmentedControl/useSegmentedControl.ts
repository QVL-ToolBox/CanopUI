import { useCallback, useId, useMemo, useRef } from "react";
import type { KeyboardEvent } from "react";
import type { CanopIconName } from "../Icon";

export type CanopSegmentedControlSize = "small" | "medium";

export interface CanopSegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
  icon?: CanopIconName;
  disabled?: boolean;
}

interface UseSegmentedControlParams<T extends string> {
  options: CanopSegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

interface UseSegmentedControlResult<T extends string> {
  groupId: string;
  registerOption: (value: T) => (node: HTMLButtonElement | null) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  isSelected: (value: T) => boolean;
  selectOption: (option: CanopSegmentedControlOption<T>) => void;
}

export function useSegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: UseSegmentedControlParams<T>): UseSegmentedControlResult<T> {
  const groupId = useId();
  const nodesRef = useRef(new Map<T, HTMLButtonElement>());

  const enabledValues = useMemo(
    () => options.filter((option) => !option.disabled).map((option) => option.value),
    [options],
  );

  const moveTo = useCallback(
    (next: T) => {
      onChange(next);
      nodesRef.current.get(next)?.focus();
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (enabledValues.length === 0) return;
      const currentIndex = enabledValues.indexOf(value);
      let nextIndex = currentIndex;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % enabledValues.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          nextIndex = currentIndex <= 0 ? enabledValues.length - 1 : currentIndex - 1;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = enabledValues.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      const nextValue = enabledValues[nextIndex];
      if (nextValue !== value) moveTo(nextValue);
    },
    [enabledValues, value, moveTo],
  );

  const registerOption = useCallback(
    (optionValue: T) => (node: HTMLButtonElement | null) => {
      if (node) nodesRef.current.set(optionValue, node);
      else nodesRef.current.delete(optionValue);
    },
    [],
  );

  const isSelected = useCallback((optionValue: T) => optionValue === value, [value]);

  const selectOption = useCallback(
    (option: CanopSegmentedControlOption<T>) => {
      if (option.disabled || option.value === value) return;
      onChange(option.value);
    },
    [onChange, value],
  );

  return { groupId, registerOption, handleKeyDown, isSelected, selectOption };
}
