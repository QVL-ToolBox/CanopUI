import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";
import { LanguageSelector } from "../LanguageSelector";
import { ThemeToggle } from "../ThemeToggle";
import { NavbarActionStack } from "./NavbarActionStack";
import {
  NAVBAR_ACTIONS_GAP,
  NAVBAR_UTILITIES_BOTTOM,
  NAVBAR_UTILITIES_RIGHT,
  NAVBAR_UTILITIES_TOP,
  NAVBAR_UTILITIES_WIDTH,
} from "./navbarStyles";

export interface NavbarUtilitiesProps {
  actions?: ReactNode;
}

export function NavbarUtilities({ actions }: NavbarUtilitiesProps) {
  return (
    <>
      <Stack
        spacing={NAVBAR_ACTIONS_GAP}
        sx={{
          position: "absolute",
          zIndex: (theme) => theme.zIndex.appBar,
          top: NAVBAR_UTILITIES_TOP,
          right: NAVBAR_UTILITIES_RIGHT,
          width: NAVBAR_UTILITIES_WIDTH,
          alignItems: "center",
        }}
      >
        <LanguageSelector width={NAVBAR_UTILITIES_WIDTH} />
        {actions ? <NavbarActionStack>{actions}</NavbarActionStack> : null}
      </Stack>
      <Box
        sx={{
          position: "absolute",
          zIndex: (theme) => theme.zIndex.appBar,
          bottom: NAVBAR_UTILITIES_BOTTOM,
          right: NAVBAR_UTILITIES_RIGHT,
        }}
      >
        <ThemeToggle />
      </Box>
    </>
  );
}
