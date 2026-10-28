import Box from "@mui/material/Box";
import { Icon, type CanopIconName } from "../Icon";
import { NavbarActiveIndicator } from "./NavbarActiveIndicator";
import { NAVBAR_TILE_RADIUS } from "./navbarTile";

export interface NavbarTileContentProps {
  label: string;
  icon?: CanopIconName;
  active: boolean;
}

export function NavbarTileContent({ label, icon, active }: NavbarTileContentProps) {
  return (
    <>
      {active && <NavbarActiveIndicator radius={NAVBAR_TILE_RADIUS} />}
      <Box component="span" sx={{ position: "relative", zIndex: 1, display: "inline-flex" }}>
        {icon ? <Icon name={icon} size="md" variant={active ? "solid" : "outline"} /> : label}
      </Box>
    </>
  );
}
