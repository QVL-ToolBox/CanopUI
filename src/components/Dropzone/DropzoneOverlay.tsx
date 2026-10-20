import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import Typography from "@mui/material/Typography";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "../Icon";
import { Stack } from "../Stack";
import { motionDurationSeconds, motionEasing, useReducedMotion } from "../../motion";

const MotionBox = motion.create(Box);

export interface DropzoneOverlayProps {
  visible: boolean;
  label: string;
}

export function DropzoneOverlay({ visible, label }: DropzoneOverlayProps) {
  const reduced = useReducedMotion();
  const transition = reduced
    ? { duration: 0 }
    : { duration: motionDurationSeconds.fast, ease: motionEasing.standard };

  return (
    <AnimatePresence>
      {visible ? (
        <MotionBox
          key="canop-dropzone-overlay"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...squircleClip("var(--canop-radius-lg)"),
            inset: 0,
            pointerEvents: "none",
            border: "0.125rem dashed var(--canop-palette-accent-main)",
            backgroundColor:
              "color-mix(in srgb, var(--canop-palette-primary-main) 16%, var(--canop-palette-background-paper))",
          }}
        >
          <Stack gap="xs" alignItems="center">
            <Icon name="upload" size="xl" color="accent" variant="solid" />
            <Typography
              variant="subtitle1"
              align="center"
              sx={{
                color: "text.primary",
              }}
            >
              {label}
            </Typography>
          </Stack>
        </MotionBox>
      ) : null}
    </AnimatePresence>
  );
}
