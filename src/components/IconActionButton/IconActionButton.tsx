import MuiIconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import { squircleFill, squircleSurface } from "../../squircle";
import type { MouseEventHandler, Ref } from "react";
import { Icon, type CanopIconName, type CanopIconSize } from "../Icon";
import { Spinner } from "../Spinner";
import { focusRingSx } from "../_shared/focusRing";
import { OptionalTooltip } from "../_shared/OptionalTooltip";
import { useIconActionButton } from "./useIconActionButton";

export type CanopIconActionButtonVariant = "default" | "danger" | "secondary" | "accent";

export interface CanopIconActionButtonProps {
  icon: CanopIconName;
  /**
   * Intention visuelle. `accent` détache une action secondaire mais désirable : fond `accent.main`,
   * survol `accent.dark`, glyphe `accent.contrastText`, identiques en thème clair et sombre.
   */
  variant?: CanopIconActionButtonVariant;
  /** Largeur et hauteur du bouton, en unités CSS relatives (rem). */
  size?: string;
  /** Taille de l'icône affichée dans le bouton. */
  iconSize?: CanopIconSize;
  disabled?: boolean;
  loading?: boolean;
  tooltip?: boolean | string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  ariaLabel: string;
  ref?: Ref<HTMLButtonElement>;
  [dataAttribute: `data-${string}`]: string | number | boolean | undefined;
}

function bgFor(isDark: boolean) {
  return {
    default: "primary.main",
    danger: "error.main",
    secondary: isDark ? "secondary.main" : "secondary.dark",
    accent: "accent.main",
  } as const;
}

function hoverBgFor(isDark: boolean) {
  return {
    default: "primary.dark",
    danger: "error.dark",
    secondary: isDark ? "secondary.dark" : "secondary.main",
    accent: "accent.dark",
  } as const;
}

function fgFor(isDark: boolean) {
  return {
    default: isDark ? "primary.contrastText" : "common.white",
    danger: "common.white",
    secondary: isDark ? "secondary.contrastText" : "common.white",
    accent: "accent.contrastText",
  } as const;
}

export function IconActionButton({
  icon,
  variant = "default",
  size = "2.5rem",
  iconSize = "md",
  disabled = false,
  loading = false,
  tooltip,
  onClick,
  ariaLabel,
  ref,
  ...dataAttributes
}: CanopIconActionButtonProps) {
  const isDark = useTheme().palette.mode === "dark";
  const bgMap = bgFor(isDark);
  const hoverBgMap = hoverBgFor(isDark);
  const fgMap = fgFor(isDark);
  const restBg = disabled ? "var(--canop-palette-action-disabledBackground)" : bgMap[variant];
  const { tooltipTitle, tooltipDescribesButton, ariaBusy, spinnerSize, handleClick } =
    useIconActionButton({
      ariaLabel,
      tooltip,
      disabled,
      loading,
      iconSize,
      onClick,
    });

  return (
    <OptionalTooltip title={tooltipTitle} describeChild={tooltipDescribesButton}>
      <MuiIconButton
        {...dataAttributes}
        ref={ref}
        onClick={handleClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-busy={ariaBusy}
        sx={{
          width: size,
          height: size,
          ...squircleSurface({
            shape: "circle",
            radius: `calc(${size} * 0.5)`,
            background: restBg,
          }),
          color: disabled ? "action.disabled" : fgMap[variant],
          transition: "all 0.15s",
          "&.Mui-focusVisible": squircleFill(restBg),
          "&:hover": squircleFill(hoverBgMap[variant]),
          "&:focus-visible": focusRingSx,
          ...(loading && { cursor: "progress" }),
        }}
      >
        {loading ? (
          <Spinner size={spinnerSize} color="inherit" />
        ) : (
          <Icon name={icon} size={iconSize} variant="solid" />
        )}
      </MuiIconButton>
    </OptionalTooltip>
  );
}
