import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEnterAnimation, type UseEnterAnimationResult } from "../../motion";

export type CanopPageContentMaxWidth = "sm" | "md" | "lg" | "full";

const contentMaxWidthValues: Record<CanopPageContentMaxWidth, string | undefined> = {
  sm: "48rem",
  md: "64rem",
  lg: "80rem",
  full: undefined,
};

interface UsePageContentParams {
  maxWidth: CanopPageContentMaxWidth;
}

interface UsePageContentResult {
  isCompact: boolean;
  contentMaxWidth: string | undefined;
  enter: UseEnterAnimationResult;
}

export function usePageContent({ maxWidth }: UsePageContentParams): UsePageContentResult {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));
  const enter = useEnterAnimation({ direction: "up", distance: "0.5rem", duration: "base" });
  return { isCompact, contentMaxWidth: contentMaxWidthValues[maxWidth], enter };
}
