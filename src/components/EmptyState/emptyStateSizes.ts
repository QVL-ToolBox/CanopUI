import { tokens } from "../../tokens";
import type { CanopHeadingSize, CanopResponsiveHeadingSize } from "../Heading";
import type { CanopStackGap } from "../Stack";

export type CanopEmptyStateSize = "sm" | "md" | "lg";

export interface EmptyStateSizeRecipe {
  minHeight: string;
  framePadding: string;
  contentMaxWidth: string;
  gap: CanopStackGap;
  badgeSize: string;
  badgePadding: string;
  badgeRadius: string;
  illustrationGap: string;
  headingSize: CanopHeadingSize | CanopResponsiveHeadingSize;
  descriptionVariant: "body1" | "body2";
}

export const EMPTY_STATE_SIZES: Record<CanopEmptyStateSize, EmptyStateSizeRecipe> = {
  sm: {
    minHeight: "12rem",
    framePadding: "1rem",
    contentMaxWidth: "24rem",
    gap: "xs",
    badgeSize: "3rem",
    badgePadding: "0.625rem",
    badgeRadius: tokens.radius.sm,
    illustrationGap: "0.375rem",
    headingSize: 5,
    descriptionVariant: "body2",
  },
  md: {
    minHeight: "22rem",
    framePadding: "1.5rem",
    contentMaxWidth: "32rem",
    gap: "sm",
    badgeSize: "4.5rem",
    badgePadding: "1rem",
    badgeRadius: tokens.radius.md,
    illustrationGap: "0.75rem",
    headingSize: 4,
    descriptionVariant: "body1",
  },
  lg: {
    minHeight: "32rem",
    framePadding: "2rem",
    contentMaxWidth: "36rem",
    gap: "md",
    badgeSize: "6rem",
    badgePadding: "1.25rem",
    badgeRadius: tokens.radius.lg,
    illustrationGap: "1rem",
    headingSize: { xs: 4, md: 3 },
    descriptionVariant: "body1",
  },
};
