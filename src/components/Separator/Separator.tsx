import Box from "@mui/material/Box";

export type CanopSeparatorVariant = "normal" | "fullWidth";

export interface CanopSeparatorProps {
  variant?: CanopSeparatorVariant;
  inset?: string;
}

const DEFAULT_INSET = "1rem";

const separatorColor =
  "color-mix(in srgb, var(--canop-palette-primary-contrastText) 25%, transparent)";

export function Separator({ variant = "normal", inset = DEFAULT_INSET }: CanopSeparatorProps) {
  const isFullWidth = variant === "fullWidth";

  return (
    <Box
      role="separator"
      sx={{
        borderBottom: "0.0625rem solid",
        borderColor: separatorColor,
        marginX: isFullWidth ? `-${inset}` : undefined,
      }}
    />
  );
}
