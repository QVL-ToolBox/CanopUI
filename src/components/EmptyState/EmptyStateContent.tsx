import Box from "@mui/material/Box";
import { squircleClip } from "../../squircle";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEnterAnimation } from "../../motion";
import { Heading, type CanopHeadingLevel } from "../Heading";
import { Stack } from "../Stack";

export interface EmptyStateContentProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  headingLevel: CanopHeadingLevel;
  animated: boolean;
}

const iconWrapperBackground =
  "color-mix(in srgb, var(--canop-palette-primary-main) 12%, var(--canop-palette-background-paper))";

export function EmptyStateContent({
  title,
  description,
  icon,
  action,
  headingLevel,
  animated,
}: EmptyStateContentProps) {
  const enter = useEnterAnimation({ direction: "up", distance: "0.75rem", disabled: !animated });

  return (
    <motion.div
      initial={enter.initial}
      animate={enter.animate}
      transition={enter.transition}
      style={{ width: "100%" }}
    >
      <Stack gap="sm" alignItems="center">
        {icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "4rem",
              height: "4rem",
              color: "primary.main",
              marginBottom: "0.5rem",
              ...squircleClip("var(--canop-radius-xl)"),
              backgroundColor: iconWrapperBackground,
            }}
          >
            {icon}
          </Box>
        )}
        <Heading level={headingLevel} size={4} align="center" gutterBottom={false}>
          {title}
        </Heading>
        {description && (
          <Typography
            align="center"
            sx={{
              color: "text.secondary",
              maxWidth: "28rem",
            }}
          >
            {description}
          </Typography>
        )}
        {action && (
          <Box
            sx={{
              marginTop: "0.5rem",
            }}
          >
            {action}
          </Box>
        )}
      </Stack>
    </motion.div>
  );
}
