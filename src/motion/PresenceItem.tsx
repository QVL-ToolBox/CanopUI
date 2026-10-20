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
  /**
   * Fait glisser l'élément jusqu'à sa nouvelle place quand un voisin sort.
   * Ignoré en mouvement réduit.
   */
  layout?: boolean;
  fill?: boolean;
  role?: AriaRole;
  ariaBusy?: boolean;
}

/**
 * Élément qui entre en fondu et sort en glissant. Doit être l'enfant direct
 * d'un `Presence` et porter une `key` stable (un id, jamais un index), posée
 * par le consommateur.
 */
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
