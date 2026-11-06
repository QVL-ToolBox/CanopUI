import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import type { AriaRole, ReactNode } from "react";
import { usePresenceItemMotion } from "./usePresenceItemMotion";

const MotionBox = motion.create(Box);

const fillSx = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
  minHeight: 0,
} as const;

export interface PresenceItemProps {
  children: ReactNode;
  layout?: boolean;
  fill?: boolean;
  role?: AriaRole;
  ariaBusy?: boolean;
}

export function PresenceItem({
  children,
  layout = false,
  fill = false,
  role,
  ariaBusy,
}: PresenceItemProps) {
  const presenceMotion = usePresenceItemMotion(layout);
  return (
    <MotionBox role={role} aria-busy={ariaBusy} sx={fill ? fillSx : undefined} {...presenceMotion}>
      {children}
    </MotionBox>
  );
}
