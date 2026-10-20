import ButtonBase from "@mui/material/ButtonBase";

export interface ToastActionButtonProps {
  label: string;
  onClick: () => void;
}

const actionSx = {
  flexShrink: 0,
  marginLeft: "auto",
  paddingX: "0.875rem",
  paddingY: "0.375rem",
  borderRadius: "var(--canop-radius-sm)",
  color: "inherit",
  font: "inherit",
  fontWeight: 700,
  whiteSpace: "nowrap",
  backgroundColor: "color-mix(in srgb, currentColor 14%, transparent)",
  transition:
    "background-color var(--canop-motion-duration-fast) var(--canop-motion-ease-standard), transform var(--canop-motion-duration-fast) var(--canop-motion-ease-spring-soft)",
  "&:hover": { backgroundColor: "color-mix(in srgb, currentColor 24%, transparent)" },
  "&:active": { transform: "scale(0.96)" },
  "&:focus-visible": { outline: "0.125rem solid currentColor", outlineOffset: "0.125rem" },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    "&:active": { transform: "none" },
  },
} as const;

export function ToastActionButton({ label, onClick }: ToastActionButtonProps) {
  return (
    <ButtonBase onClick={onClick} sx={actionSx}>
      {label}
    </ButtonBase>
  );
}
