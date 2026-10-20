import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { scrollbarSx } from "../../scrollbar";
import { Heading } from "../Heading";
import { Stack } from "../Stack";
import { tokens } from "../../tokens";
import { keepAbovePageBottom } from "../_shared/pageBottomInset";
import { usePageContent, type CanopPageContentMaxWidth } from "./usePageContent";

export type { CanopPageContentMaxWidth } from "./usePageContent";

export interface CanopPageContentProps {
  title?: string;
  footer?: ReactNode;
  align?: "left" | "center";
  fillHeight?: boolean;
  hugContent?: boolean;
  maxWidth?: CanopPageContentMaxWidth;
  children: ReactNode;
}

const gutters = {
  xs: tokens.spacing.sm,
  sm: tokens.spacing.lg,
  md: tokens.spacing.xl,
  lg: tokens.spacing["2xl"],
};

export function PageContent({
  title,
  footer,
  align = "left",
  fillHeight = false,
  hugContent = false,
  maxWidth = "lg",
  children,
}: CanopPageContentProps) {
  const { isCompact, contentMaxWidth, enter } = usePageContent({ maxWidth });

  const columnStyle: CSSProperties = {
    width: "100%",
    maxWidth: contentMaxWidth,
    marginInline: "auto",
    paddingBottom: keepAbovePageBottom(),
    textAlign: align === "center" ? "center" : "left",
    ...(fillHeight && !hugContent
      ? { flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }
      : {}),
  };

  return (
    <Box
      sx={[
        {
          ...(fillHeight && !hugContent ? { display: "flex", flexDirection: "column" } : {}),
          flex: hugContent ? undefined : 1,
          minHeight: 0,
          paddingX: gutters,
          paddingTop: { xs: tokens.spacing.md, md: tokens.spacing.xl },

          paddingBottom: hugContent
            ? 0
            : {
                xs: tokens.spacing.xl,
                md: fillHeight ? tokens.spacing["3xl"] : tokens.spacing.xl,
              },
        },
        hugContent
          ? {}
          : fillHeight
            ? { overflow: "hidden" }
            : { overflowY: "auto", ...scrollbarSx() },
      ]}
    >
      <motion.div
        initial={enter.initial}
        animate={enter.animate}
        transition={enter.transition}
        style={columnStyle}
      >
        {title ? (
          <Heading level={2} size={isCompact ? 5 : 4}>
            {title}
          </Heading>
        ) : null}
        <Stack gap="md" fill={fillHeight}>
          {children}
        </Stack>
        {footer}
      </motion.div>
    </Box>
  );
}
