import MuiIconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import { squircleFill, squircleSurface } from "../../squircle";
import type { MouseEventHandler, PointerEventHandler, Ref } from "react";
import { Icon, type CanopIconName, type CanopIconSize } from "../Icon";
import { Spinner } from "../Spinner";
import { hoverOrKeyboardFocus } from "../../interaction";
import { OptionalTooltip } from "../_shared/OptionalTooltip";
import { useIconActionButton, type CanopIconActionButtonType } from "./useIconActionButton";

export type { CanopIconActionButtonType };

export type CanopIconActionButtonVariant = "default" | "danger" | "secondary" | "accent";

export interface CanopIconActionButtonProps {
  icon: CanopIconName;
  variant?: CanopIconActionButtonVariant;
  size?: string;
  iconSize?: CanopIconSize;
  type?: CanopIconActionButtonType;
  disabled?: boolean;
  loading?: boolean;
  tooltip?: boolean | string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
  onPointerDown?: PointerEventHandler<HTMLButtonElement>;
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
  type = "button",
  disabled = false,
  loading = false,
  tooltip,
  onClick,
  onMouseDown,
  onPointerDown,
  ariaLabel,
  ref,
  ...dataAttributes
}: CanopIconActionButtonProps) {
  const isDark = useTheme().palette.mode === "dark";
  const bgMap = bgFor(isDark);
  const hoverBgMap = hoverBgFor(isDark);
  const fgMap = fgFor(isDark);
  const restBg = disabled ? "var(--canop-palette-action-disabledBackground)" : bgMap[variant];
  const { tooltipTitle, tooltipDescribesButton, ariaBusy, spinnerSize, buttonType, handleClick } =
    useIconActionButton({
      ariaLabel,
      tooltip,
      disabled,
      loading,
      iconSize,
      type,
      onClick,
    });

  return (
    <OptionalTooltip title={tooltipTitle} describeChild={tooltipDescribesButton}>
      <MuiIconButton
        {...dataAttributes}
        ref={ref}
        type={buttonType}
        onClick={handleClick}
        onMouseDown={onMouseDown}
        onPointerDown={onPointerDown}
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
          [hoverOrKeyboardFocus()]: squircleFill(hoverBgMap[variant]),
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
