import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { NavbarActionStack } from "./NavbarActionStack";
import {
  NAVBAR_MOBILE_ACTIONS_TOP,
  NAVBAR_MOBILE_SETTINGS_RIGHT,
  NAVBAR_MOBILE_SETTINGS_SIZE,
} from "./navbarStyles";

export interface NavbarMobileActionDockProps {
  children: ReactNode;
}

export function NavbarMobileActionDock({ children }: NavbarMobileActionDockProps) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: NAVBAR_MOBILE_ACTIONS_TOP,
        right: NAVBAR_MOBILE_SETTINGS_RIGHT,
        zIndex: (theme) => theme.zIndex.appBar + 1,
        width: NAVBAR_MOBILE_SETTINGS_SIZE,
      }}
    >
      <NavbarActionStack>{children}</NavbarActionStack>
    </Box>
  );
}
