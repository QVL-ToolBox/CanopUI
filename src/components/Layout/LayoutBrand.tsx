import Stack from "@mui/material/Stack";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Heading } from "../Heading";
import type { UseEnterAnimationResult } from "../../motion";

export interface LayoutBrandProps {
  brand: string;
  logo?: ReactNode;
  entry: UseEnterAnimationResult;
}

export function LayoutBrand({ brand, logo, entry }: LayoutBrandProps) {
  return (
    <motion.div initial={entry.initial} animate={entry.animate} transition={entry.transition}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: { xs: "1.5rem", md: "2rem" },
        }}
      >
        {logo}
        <Heading level={1} size={2} gutterBottom={false} color="primary.contrastText">
          {brand}
        </Heading>
      </Stack>
    </motion.div>
  );
}
