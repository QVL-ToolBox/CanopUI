import Box from "@mui/material/Box";
import { squircleFill, squircleSurface } from "../../squircle";
import { hoverOrKeyboardFocus, withoutFocusRing } from "../../interaction";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import type { KeyboardEvent } from "react";
import { Icon } from "../Icon";
import { Stack } from "../Stack";
import type { CanopLightboxItem } from "./Lightbox";
import { LightboxMedia } from "./LightboxMedia";
import type { CanopLightboxMotion } from "./useLightbox";

const MotionBox = motion.create(Box);

export interface LightboxSurfaceProps {
  item: CanopLightboxItem;
  titleId: string;
  animation: CanopLightboxMotion;
  hasMultiple: boolean;
  counterLabel: string;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

const controlSx = {
  color: "text.primary",
  ...squircleSurface({
    radius: "50%",
    shape: "circle",
    background: "var(--canop-palette-surface-overlay)",
    shadow: "var(--canop-drop-shadow-e3)",
  }),
  minWidth: "3rem",
  minHeight: "3rem",
  [hoverOrKeyboardFocus()]: squircleFill("var(--canop-palette-surface-base)"),
} as const;

export function LightboxSurface({
  item,
  titleId,
  animation,
  hasMultiple,
  counterLabel,
  closeLabel,
  previousLabel,
  nextLabel,
  onClose,
  onPrev,
  onNext,
  onKeyDown,
}: LightboxSurfaceProps) {
  return (
    <MotionBox
      role="dialog"
      aria-modal="true"
      aria-labelledby={item.title ? titleId : undefined}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={animation.transition}
      sx={{
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        inset: 0,
        padding: { xs: "var(--canop-spacing-md)", md: "var(--canop-spacing-2xl)" },
        ...withoutFocusRing,
      }}
    >
      <IconButton
        aria-label={closeLabel}
        onClick={onClose}
        sx={{
          ...controlSx,
          position: "absolute",
          top: "var(--canop-spacing-md)",
          right: "var(--canop-spacing-md)",
        }}
      >
        <Icon name="close" size="sm" />
      </IconButton>

      {hasMultiple ? (
        <IconButton
          aria-label={previousLabel}
          onClick={onPrev}
          sx={{
            ...controlSx,
            position: "absolute",
            left: "var(--canop-spacing-md)",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <Icon name="caretLeft" size="md" />
        </IconButton>
      ) : null}

      <Stack gap="sm" alignItems="center">
        <LightboxMedia item={item} />
        <Box
          id={titleId}
          sx={{
            textAlign: "center",
          }}
        >
          {item.title ? (
            <Typography
              variant="subtitle1"
              sx={{
                color: "common.white",
              }}
            >
              {item.title}
            </Typography>
          ) : null}
          {hasMultiple ? (
            <Typography
              variant="caption"
              sx={{
                color: "common.white",
                opacity: 0.8,
              }}
            >
              {counterLabel}
            </Typography>
          ) : null}
        </Box>
      </Stack>

      {hasMultiple ? (
        <IconButton
          aria-label={nextLabel}
          onClick={onNext}
          sx={{
            ...controlSx,
            position: "absolute",
            right: "var(--canop-spacing-md)",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <Icon name="caretRight" size="md" />
        </IconButton>
      ) : null}
    </MotionBox>
  );
}
