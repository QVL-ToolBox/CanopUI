import Box from "@mui/material/Box";
import { NAVBAR_SEPARATOR } from "./navbarTone";

export function NavbarDivider() {
  return (
    <Box
      role="separator"
      sx={{
        borderBottom: "0.0625rem solid",
        borderColor: NAVBAR_SEPARATOR,
      }}
    />
  );
}
