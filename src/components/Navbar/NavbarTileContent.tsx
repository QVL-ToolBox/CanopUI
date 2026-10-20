import Box from "@mui/material/Box";
import { Icon } from "../Icon";
import { NavbarActiveIndicator } from "./NavbarActiveIndicator";
import { type CanopNavbarItem } from "./navigation";

export interface NavbarTileContentProps {
  item: CanopNavbarItem;
  active: boolean;
}

export function NavbarTileContent({ item, active }: NavbarTileContentProps) {
  return (
    <>
      {active && <NavbarActiveIndicator radius="var(--canop-radius-lg)" />}
      <Box component="span" sx={{ position: "relative", zIndex: 1, display: "inline-flex" }}>
        {item.icon ? <Icon name={item.icon} size="md" /> : item.label}
      </Box>
    </>
  );
}
