import ButtonBase from "@mui/material/ButtonBase";
import type { ElementType, ReactNode } from "react";
import {
  usePressable,
  type CanopPressableRadius,
  type CanopPressableSpacing,
} from "./usePressable";

export type { CanopPressableRadius, CanopPressableSpacing };

export type CanopPressableRole = "button" | "radio" | "checkbox" | "tab" | "option" | "switch";

export interface CanopPressableProps {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  radius?: CanopPressableRadius;
  size?: string;
  background?: string;
  padding?: CanopPressableSpacing;
  selected?: boolean;
  dimWhenDisabled?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
  role?: CanopPressableRole;
  ariaChecked?: boolean;
  ariaPressed?: boolean;
  as?: ElementType;
}

export function Pressable({
  children,
  onClick,
  disabled = false,
  radius = "md",
  size,
  background,
  padding = "none",
  selected = false,
  dimWhenDisabled = true,
  fullWidth = false,
  ariaLabel,
  role,
  ariaChecked,
  ariaPressed,
  as,
}: CanopPressableProps) {
  const { rootSx } = usePressable({
    radius,
    padding,
    size,
    background,
    selected,
    fullWidth,
    disabled,
    dimWhenDisabled,
  });

  return (
    <ButtonBase
      component={as ?? "button"}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      role={role}
      aria-checked={ariaChecked}
      aria-pressed={ariaPressed}
      sx={rootSx}
    >
      {children}
    </ButtonBase>
  );
}
