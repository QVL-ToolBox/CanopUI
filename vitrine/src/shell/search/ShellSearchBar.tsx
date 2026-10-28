import Stack from "@mui/material/Stack";
import { avoidPageTopRight } from "@canop/ui";
import { ShellSearch } from "./ShellSearch";

export function ShellSearchBar() {
  return (
    <Stack
      direction="row"
      role="search"
      sx={{
        position: "relative",
        zIndex: 2,
        flexShrink: 0,
        justifyContent: "center",
        paddingTop: { xs: "0.75rem", sm: "1rem" },
        paddingLeft: { xs: "0.75rem", sm: "1.5rem", md: "2rem" },
        paddingRight: {
          xs: avoidPageTopRight("0.75rem"),
          sm: avoidPageTopRight("1.5rem"),
          md: avoidPageTopRight("2rem"),
        },
      }}
    >
      <ShellSearch />
    </Stack>
  );
}
