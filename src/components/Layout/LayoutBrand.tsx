import Stack from "@mui/material/Stack";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Heading } from "../Heading";
import { titleSemantics, type CanopTitleLevel } from "../_shared/titleLevel";
import type { UseEnterAnimationResult } from "../../motion";

export interface LayoutBrandProps {
  brand: string;
  level: CanopTitleLevel;
  logo?: ReactNode;
  entry: UseEnterAnimationResult;
}

export function LayoutBrand({ brand, level, logo, entry }: LayoutBrandProps) {
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
        <Heading {...titleSemantics(level)} size={2} gutterBottom={false}>
          {brand}
        </Heading>
      </Stack>
    </motion.div>
  );
}
