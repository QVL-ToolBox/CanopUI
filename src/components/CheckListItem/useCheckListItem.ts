import { useCallback, type ReactNode } from "react";

export type CanopCheckListItemCheckboxPlacement = "start" | "end";

export type CheckListItemContent = "editor" | "toggle-label" | "static-label";

export interface UseCheckListItemParams {
  checked: boolean;
  muted: boolean;
  editor: ReactNode;
  checkboxPlacement: CanopCheckListItemCheckboxPlacement;
  onCheckedChange?: (checked: boolean) => void;
}

export interface CheckListItemStateAttributes {
  "data-checked": "on" | "off";
  "data-muted": "on" | "off";
}

export interface UseCheckListItemResult {
  content: CheckListItemContent;
  toggleAtStart: boolean;
  toggleAtEnd: boolean;
  toggleDimmed: boolean;
  handleCheckedChange: (checked: boolean) => void;
  stateAttributes: CheckListItemStateAttributes;
}

function flag(active: boolean): "on" | "off" {
  return active ? "on" : "off";
}

function contentOf(editing: boolean, labelToggles: boolean): CheckListItemContent {
  if (editing) return "editor";
  if (labelToggles) return "toggle-label";
  return "static-label";
}

export function useCheckListItem({
  checked,
  muted,
  editor,
  checkboxPlacement,
  onCheckedChange,
}: UseCheckListItemParams): UseCheckListItemResult {
  const checkable = onCheckedChange !== undefined;
  const editing = editor !== undefined && editor !== null && editor !== false;
  const toggleAtStart = checkable && checkboxPlacement === "start";
  const toggleAtEnd = checkable && checkboxPlacement === "end";

  const handleCheckedChange = useCallback(
    (next: boolean) => {
      onCheckedChange?.(next);
    },
    [onCheckedChange],
  );

  return {
    content: contentOf(editing, toggleAtStart),
    toggleAtStart,
    toggleAtEnd,
    toggleDimmed: toggleAtEnd && muted,
    handleCheckedChange,
    stateAttributes: { "data-checked": flag(checked), "data-muted": flag(muted) },
  };
}
