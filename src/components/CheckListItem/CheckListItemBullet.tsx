import Box from "@mui/material/Box";
import { checkListItemBulletSx } from "./checkListItemSx";

interface CheckListItemBulletProps {
  struck: boolean;
}

export function CheckListItemBullet({ struck }: CheckListItemBulletProps) {
  return (
    <Box component="span" aria-hidden data-marker="bullet" sx={checkListItemBulletSx(struck)} />
  );
}
