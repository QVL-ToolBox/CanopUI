import Box from "@mui/material/Box";
import { Checkbox } from "../Checkbox";
import { CheckListItemLabel } from "./CheckListItemLabel";
import { checkListItemToggleSx, type CanopCheckListItemCheckboxSize } from "./checkListItemSx";

interface CheckListItemToggleProps {
  label: string;
  checked: boolean;
  disabled: boolean;
  labelHidden: boolean;
  size: CanopCheckListItemCheckboxSize;
  dimmed: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function CheckListItemToggle({
  label,
  checked,
  disabled,
  labelHidden,
  size,
  dimmed,
  onCheckedChange,
}: CheckListItemToggleProps) {
  return (
    <Box component="label" sx={checkListItemToggleSx(disabled, !labelHidden, size, dimmed)}>
      <Checkbox
        checked={checked}
        onChange={onCheckedChange}
        disabled={disabled}
        ariaLabel={labelHidden ? label : undefined}
      />
      {labelHidden ? null : <CheckListItemLabel label={label} struck={checked} />}
    </Box>
  );
}
