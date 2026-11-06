import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { Stack } from "../Stack";
import { CheckListItemBullet } from "./CheckListItemBullet";
import { CheckListItemText } from "./CheckListItemText";
import { CheckListItemToggle } from "./CheckListItemToggle";
import { checkListItemBodySx, type CanopCheckListItemCheckboxSize } from "./checkListItemSx";
import { useCheckListItem, type CanopCheckListItemCheckboxPlacement } from "./useCheckListItem";

export type { CanopCheckListItemCheckboxPlacement, CanopCheckListItemCheckboxSize };

export type CanopCheckListItemMarker = "none" | "bullet";

export interface CanopCheckListItemProps {
  label: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  muted?: boolean;
  disabled?: boolean;
  editor?: ReactNode;
  actions?: ReactNode;
  marker?: CanopCheckListItemMarker;
  checkboxPlacement?: CanopCheckListItemCheckboxPlacement;
  checkboxSize?: CanopCheckListItemCheckboxSize;
}

export function CheckListItem({
  label,
  checked = false,
  onCheckedChange,
  muted = false,
  disabled = false,
  editor,
  actions,
  marker = "none",
  checkboxPlacement = "start",
  checkboxSize = "medium",
}: CanopCheckListItemProps) {
  const {
    content,
    toggleAtStart,
    toggleAtEnd,
    toggleDimmed,
    handleCheckedChange,
    stateAttributes,
  } = useCheckListItem({
    checked,
    muted,
    editor,
    checkboxPlacement,
    onCheckedChange,
  });

  const toggle = (
    <CheckListItemToggle
      label={label}
      checked={checked}
      disabled={disabled}
      labelHidden={content !== "toggle-label"}
      size={checkboxSize}
      dimmed={toggleDimmed}
      onCheckedChange={handleCheckedChange}
    />
  );

  return (
    <Stack direction="row" alignItems="center" gap="xs" {...stateAttributes}>
      <Box sx={checkListItemBodySx(muted)}>
        {marker === "bullet" ? <CheckListItemBullet struck={checked} /> : null}
        {toggleAtStart ? toggle : null}
        <CheckListItemText content={content} label={label} struck={checked} editor={editor} />
      </Box>
      {actions ? (
        <Stack direction="row" alignItems="center" gap="xs">
          {actions}
        </Stack>
      ) : null}
      {toggleAtEnd ? toggle : null}
    </Stack>
  );
}
