import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Heading, type CanopHeadingLevel } from "../Heading";
import { Stack } from "../Stack";
import { EmptyStateDescription } from "./EmptyStateDescription";
import { EmptyStateIllustration } from "./EmptyStateIllustration";
import type { EmptyStateIllustrationSx } from "./emptyStateIllustrationSx";
import type { EmptyStateSizeRecipe } from "./emptyStateSizes";
import type { EmptyStateMotion } from "./useEmptyStateMotion";

export interface EmptyStateContentProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  headingLevel: CanopHeadingLevel;
  recipe: EmptyStateSizeRecipe;
  choreography: EmptyStateMotion;
  illustrationSx: EmptyStateIllustrationSx;
}

const FULL_WIDTH = { width: "100%" } as const;
const ACTION_BREATHING_ROOM = { paddingTop: "0.5rem" } as const;

export function EmptyStateContent({
  title,
  description,
  icon,
  action,
  headingLevel,
  recipe,
  choreography,
  illustrationSx,
}: EmptyStateContentProps) {
  return (
    <motion.div
      initial={choreography.initial}
      animate="visible"
      variants={choreography.reveal}
      style={FULL_WIDTH}
    >
      <Stack gap={recipe.gap} alignItems="center">
        {icon && (
          <EmptyStateIllustration
            icon={icon}
            choreography={choreography}
            illustrationSx={illustrationSx}
          />
        )}
        <motion.div variants={choreography.rise}>
          <Heading
            level={headingLevel}
            size={recipe.headingSize}
            align="center"
            gutterBottom={false}
          >
            {title}
          </Heading>
        </motion.div>
        {description && (
          <motion.div variants={choreography.rise} style={FULL_WIDTH}>
            <EmptyStateDescription description={description} variant={recipe.descriptionVariant} />
          </motion.div>
        )}
        {action && (
          <motion.div variants={choreography.rise} style={ACTION_BREATHING_ROOM}>
            {action}
          </motion.div>
        )}
      </Stack>
    </motion.div>
  );
}
