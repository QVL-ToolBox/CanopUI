import Box from "@mui/material/Box";
import { checkListItemLabelSx } from "./checkListItemSx";

interface CheckListItemLabelProps {
  label: string;
  struck: boolean;
}

export function CheckListItemLabel({ label, struck }: CheckListItemLabelProps) {
  return (
    <Box component="span" data-struck={struck ? "on" : "off"} sx={checkListItemLabelSx(struck)}>
      {label}
    </Box>
  );
}
