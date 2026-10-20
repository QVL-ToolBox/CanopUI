import Box from "@mui/material/Box";
import { squircleClip, squircleSurface } from "../../squircle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CanopPaletteColorName } from "../_shared/paletteColorVar";
import { useFieldLabelling } from "../_shared/useFieldLabelling";

export type CanopToggleColor = Extract<
  CanopPaletteColorName,
  "primary" | "secondary" | "accent" | "success"
>;

export interface CanopToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Libellé visible à côté de l'interrupteur, et nom accessible par défaut. */
  label?: string;
  /** Nom accessible explicite, pour un interrupteur sans libellé visible. Prend le pas sur `label`. */
  ariaLabel?: string;
  size?: "small" | "medium";
  color?: CanopToggleColor;
}

const sizes = {
  small: { track: { w: 40, h: 22 }, thumb: 16, offset: 3 },
  medium: { track: { w: 52, h: 28 }, thumb: 22, offset: 3 },
} as const;

export function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
  ariaLabel,
  size = "medium",
  color = "accent",
}: CanopToggleProps) {
  const { labelId, labelledBy, accessibleName } = useFieldLabelling({ label, ariaLabel });
  const s = sizes[size];
  const thumbLeft = checked ? s.track.w - s.thumb - s.offset : s.offset;
  const toggle = () => !disabled && onChange(!checked);

  const control = (
    <Box
      component="button"
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={accessibleName}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={toggle}
      sx={{
        position: "relative",
        width: `${s.track.w / 16}rem`,
        height: `${s.track.h / 16}rem`,
        padding: 0,
        border: "none",
        bgcolor: checked ? `${color}.main` : "grey.400",
        flexShrink: 0,
        ...squircleClip(`${s.track.h / 32}rem`, { shape: "pill" }),
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "default" : "pointer",
        transition: "background-color 200ms ease",
      }}
    >
      <Box
        sx={{
          top: `${s.offset / 16}rem`,
          left: `${thumbLeft / 16}rem`,
          width: `${s.thumb / 16}rem`,
          height: `${s.thumb / 16}rem`,
          bgcolor: "common.white",

          ...squircleSurface({
            radius: "50%",
            shape: "dot",
            background: "var(--canop-palette-common-white)",
            shadow: "var(--canop-drop-shadow-e1)",
          }),
          position: "absolute",
          transition: "left 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </Box>
  );

  if (!label) return control;

  return (
    <Stack
      direction="row"
      spacing="0.5rem"
      sx={{
        alignItems: "center",
      }}
    >
      {control}
      <Typography
        id={labelId}
        variant="body2"
        onClick={toggle}
        sx={{
          color: "text.secondary",
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.5 : 1,
          userSelect: "none",
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}
