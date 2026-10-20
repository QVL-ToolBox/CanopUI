import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import type { CanopOverlayMotion } from "./overlayMotion";

const MotionBox = motion.create(Box);

export interface OverlayBackdropProps {
  animation: CanopOverlayMotion;
  onClick: () => void;
}

export function OverlayBackdrop({ animation, onClick }: OverlayBackdropProps) {
  return (
    <MotionBox
      aria-hidden
      onClick={onClick}
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={animation.transition}
      sx={{ position: "fixed", bgcolor: "common.black", inset: 0 }}
    />
  );
}
