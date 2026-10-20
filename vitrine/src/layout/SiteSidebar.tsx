import Box from "@mui/material/Box";
import { NavTree } from "./NavTree";

export interface SiteSidebarProps {
  activePath: string;
}

export function SiteSidebar({ activePath }: SiteSidebarProps) {
  return (
    <Box
      component="nav"
      sx={{
        display: { xs: "none", md: "block" },
        width: "17rem",
        flexShrink: 0,
        paddingY: "2rem",
        paddingX: "1rem",
        borderRight: "0.0625rem solid",
        borderColor: "divider",
        position: "sticky",
        top: "4.25rem",
        alignSelf: "flex-start",
        maxHeight: "calc(100vh - 4.25rem)",
        overflowY: "auto",
      }}
    >
      <NavTree activePath={activePath} />
    </Box>
  );
}
