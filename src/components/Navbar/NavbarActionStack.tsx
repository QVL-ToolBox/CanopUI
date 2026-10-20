import Stack from "@mui/material/Stack";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEnterAnimation } from "../../motion";
import { NAVBAR_ACTIONS_GAP } from "./navbarStyles";

export interface NavbarActionStackProps {
  children: ReactNode;
}

export function NavbarActionStack({ children }: NavbarActionStackProps) {
  const entry = useEnterAnimation({ direction: "down", distance: "0.5rem", duration: "fast" });

  return (
    <motion.div initial={entry.initial} animate={entry.animate} transition={entry.transition}>
      <Stack spacing={NAVBAR_ACTIONS_GAP} sx={{ alignItems: "center" }}>
        {children}
      </Stack>
    </motion.div>
  );
}
