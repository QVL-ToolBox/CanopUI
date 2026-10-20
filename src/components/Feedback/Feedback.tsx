import Alert from "@mui/material/Alert";
import type { ReactNode } from "react";

export type CanopFeedbackSeverity = "success" | "error" | "info" | "warning";

export interface CanopFeedbackProps {
  severity?: CanopFeedbackSeverity;
  children?: ReactNode;
  onClose?: () => void;
}

export function Feedback({ severity = "info", children, onClose }: CanopFeedbackProps) {
  if (!children) {
    return null;
  }

  return (
    <Alert severity={severity} onClose={onClose}>
      {children}
    </Alert>
  );
}
