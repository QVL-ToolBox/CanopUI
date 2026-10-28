import { useTheme } from "@mui/material/styles";

export function useNeonGlow(): boolean {
  return useTheme().palette.mode === "dark";
}
