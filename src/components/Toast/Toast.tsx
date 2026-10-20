import Box from "@mui/material/Box";
import Portal from "@mui/material/Portal";
import Snackbar from "@mui/material/Snackbar";
import { squircleClip } from "../../squircle";
import { tokens } from "../../tokens";
import type { CanopFeedbackSeverity } from "../Feedback";
import { Icon, type CanopIconName } from "../Icon";
import { ToastActionButton } from "./ToastActionButton";
import { useToastHandlers, type CanopToastAction } from "./useToastHandlers";

export type { CanopToastAction } from "./useToastHandlers";

export type CanopToastSeverity = Extract<CanopFeedbackSeverity, "success" | "error" | "info">;

export interface CanopToastProps {
  open: boolean;

  message: string;

  onClose: () => void;

  severity?: CanopToastSeverity;

  duration?: number;

  action?: CanopToastAction;
}

const severityStyles: Record<CanopToastSeverity, { bg: string; fg: string; icon: CanopIconName }> =
  {
    success: { bg: "primary.main", fg: "primary.contrastText", icon: "check" },
    error: { bg: "error.main", fg: "error.contrastText", icon: "cancel" },
    info: { bg: "secondary.main", fg: "secondary.contrastText", icon: "shield" },
  };

const DEFAULT_TOAST_DURATION = 3000;
const ACTION_TOAST_DURATION = 6000;

export function Toast({
  open,
  message,
  onClose,
  severity = "success",
  duration,
  action,
}: CanopToastProps) {
  const style = severityStyles[severity];
  const hideDuration = duration ?? (action ? ACTION_TOAST_DURATION : DEFAULT_TOAST_DURATION);
  const { handleSnackbarClose, handleAction } = useToastHandlers(onClose, action);
  return (
    <Portal>
      <Snackbar
        open={open}
        autoHideDuration={hideDuration}
        resumeHideDuration={hideDuration}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box
          sx={{
            maxWidth: "35rem",
            filter: "var(--canop-drop-shadow-e3)",
          }}
        >
          <Box
            role="status"
            sx={[
              {
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                paddingX: "1.75rem",
                paddingY: "0.875rem",
                color: style.fg,
                bgcolor: style.bg,
                fontSize: "1.05rem",
                fontWeight: 500,
              },
              squircleClip(tokens.radius.md),
            ]}
          >
            <Icon name={style.icon} variant="solid" size="md" color="inherit" />
            {message}
            {action && <ToastActionButton label={action.label} onClick={handleAction} />}
          </Box>
        </Box>
      </Snackbar>
    </Portal>
  );
}
