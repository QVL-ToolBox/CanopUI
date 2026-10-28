import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useId } from "react";
import { useTranslation } from "../../i18n";
import type { CanopPaletteColorName } from "../_shared/paletteColorVar";
import { ContentSkeleton } from "../Skeleton/ContentSkeleton";
import { PaletteStrokeGradient } from "./PaletteStrokeGradient";
import { useSpinnerSkeleton } from "./useSpinnerSkeleton";

export type CanopSpinnerSize = "small" | "medium" | "large";
export type CanopSpinnerColor = CanopPaletteColorName | "inherit";

export interface CanopSpinnerProps {
  fullPage?: boolean;
  size?: CanopSpinnerSize;
  color?: CanopSpinnerColor;
  ariaLabel?: string;
  skeleton?: boolean;
}

const sizeMapping: Record<CanopSpinnerSize, string> = {
  small: "1.25rem",
  medium: "2.5rem",
  large: "4rem",
};

const thicknessMapping: Record<CanopSpinnerSize, number> = {
  small: 4.5,
  medium: 3.6,
  large: 3,
};

const slowerButStillSpinningInReducedMotionSx = {
  "@media (prefers-reduced-motion: reduce)": {
    animationIterationCount: "infinite !important",
    animationDuration: "2.8s !important",
    "& .MuiCircularProgress-circle": {
      animationIterationCount: "infinite !important",
      animationDuration: "2.8s !important",
    },
  },
} as const;

function urlSafeGradientIdFrom(reactId: string): string {
  return `canop-spinner-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

export function Spinner({
  fullPage = false,
  size = "medium",
  color = "accent",
  ariaLabel,
  skeleton = true,
}: CanopSpinnerProps) {
  const { t } = useTranslation();
  const gradientId = urlSafeGradientIdFrom(useId());
  const skeletonShape = useSpinnerSkeleton({ skeleton, fullPage, size, color });

  if (skeletonShape) {
    return <ContentSkeleton shape={skeletonShape} ariaLabel={ariaLabel} />;
  }

  const progress = (
    <>
      {color !== "inherit" && <PaletteStrokeGradient id={gradientId} color={color} />}
      <CircularProgress
        size={sizeMapping[size]}
        thickness={thicknessMapping[size]}
        color={color}
        aria-label={ariaLabel ?? t("canop.spinner.loading")}
        sx={{
          ...slowerButStillSpinningInReducedMotionSx,
          "& .MuiCircularProgress-circle": {
            stroke: color === "inherit" ? "currentColor" : `url(#${gradientId})`,
            strokeLinecap: "round",
          },
        }}
      />
    </>
  );

  if (!fullPage) {
    return progress;
  }

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      {progress}
    </Box>
  );
}
