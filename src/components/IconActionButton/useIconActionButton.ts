import type { MouseEventHandler } from "react";
import type { CanopIconSize } from "../Icon";
import type { CanopSpinnerSize } from "../Spinner";

export interface UseIconActionButtonOptions {
  ariaLabel: string;
  tooltip?: boolean | string;
  disabled: boolean;
  loading: boolean;
  iconSize: CanopIconSize;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface UseIconActionButtonResult {
  tooltipTitle?: string;
  tooltipDescribesButton: boolean;
  ariaBusy?: true;
  spinnerSize: CanopSpinnerSize;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}

const spinnerSizeByIconSize: Record<CanopIconSize, CanopSpinnerSize> = {
  xs: "small",
  sm: "small",
  md: "small",
  lg: "small",
  xl: "medium",
};

function tooltipTitleFrom(tooltip: boolean | string | undefined, ariaLabel: string) {
  if (tooltip === true) return ariaLabel;
  if (typeof tooltip === "string" && tooltip !== "") return tooltip;
  return undefined;
}

export function useIconActionButton({
  ariaLabel,
  tooltip,
  disabled,
  loading,
  iconSize,
  onClick,
}: UseIconActionButtonOptions): UseIconActionButtonResult {
  const tooltipTitle = disabled ? undefined : tooltipTitleFrom(tooltip, ariaLabel);

  return {
    tooltipTitle,
    tooltipDescribesButton: tooltipTitle !== undefined && tooltipTitle !== ariaLabel,
    ariaBusy: loading ? true : undefined,
    spinnerSize: spinnerSizeByIconSize[iconSize],
    handleClick: loading ? undefined : onClick,
  };
}
