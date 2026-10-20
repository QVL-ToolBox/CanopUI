import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export type CanopNavbarMode = "mobile" | "tablet" | "desktop";

export function useNavbarMode(): CanopNavbarMode {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  if (isMobile) return "mobile";
  if (isTablet) return "tablet";
  return "desktop";
}
