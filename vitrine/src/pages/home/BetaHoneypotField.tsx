import Box from "@mui/material/Box";

const HIDDEN_FROM_PEOPLE = {
  position: "absolute",
  width: "0.0625rem",
  height: "0.0625rem",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
} as const;

export interface BetaHoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function BetaHoneypotField({ value, onChange }: BetaHoneypotFieldProps) {
  return (
    <Box aria-hidden sx={HIDDEN_FROM_PEOPLE}>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Box>
  );
}
