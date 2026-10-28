import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { EmptyStateIllustrationSx } from "./emptyStateIllustrationSx";
import type { EmptyStateMotion } from "./useEmptyStateMotion";

export interface EmptyStateIllustrationProps {
  icon: ReactNode;
  choreography: EmptyStateMotion;
  illustrationSx: EmptyStateIllustrationSx;
}

export function EmptyStateIllustration({
  icon,
  choreography,
  illustrationSx,
}: EmptyStateIllustrationProps) {
  return (
    <motion.div variants={choreography.pop}>
      <Box sx={illustrationSx.halo}>
        <Box sx={illustrationSx.float}>
          <Box sx={illustrationSx.badge}>{icon}</Box>
        </Box>
      </Box>
    </motion.div>
  );
}
