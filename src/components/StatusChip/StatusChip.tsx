import Chip from "@mui/material/Chip";

export type CanopStatusTone = "success" | "warning" | "error" | "info" | "neutral";

export interface CanopStatusChipProps {
  tone?: CanopStatusTone;
  label: string;
  size?: "small" | "medium";
}

const toneMapping = {
  success: "success",
  warning: "warning",
  error: "error",
  info: "info",
  neutral: "default",
} as const;

export function StatusChip({ tone = "neutral", label, size = "small" }: CanopStatusChipProps) {
  return <Chip label={label} color={toneMapping[tone]} size={size} variant="filled" />;
}
