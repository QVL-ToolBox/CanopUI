import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import { LanguageSelector } from "../LanguageSelector";
import { ThemeToggle } from "../ThemeToggle";
import type { UseEnterAnimationResult } from "../../motion";

export interface LayoutUtilitiesProps {
  entry: UseEnterAnimationResult;
}

export function LayoutUtilities({ entry }: LayoutUtilitiesProps) {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          zIndex: 3,
          top: "calc(env(safe-area-inset-top, 0rem) + 1rem)",
          right: "calc(env(safe-area-inset-right, 0rem) + 1rem)",
        }}
      >
        <motion.div initial={entry.initial} animate={entry.animate} transition={entry.transition}>
          <LanguageSelector width="4.5rem" />
        </motion.div>
      </Box>
      <Box
        sx={{
          position: "absolute",
          zIndex: 3,
          bottom: "calc(env(safe-area-inset-bottom, 0rem) + 1rem)",
          right: "calc(env(safe-area-inset-right, 0rem) + 1rem)",
        }}
      >
        <motion.div initial={entry.initial} animate={entry.animate} transition={entry.transition}>
          <ThemeToggle />
        </motion.div>
      </Box>
    </>
  );
}
