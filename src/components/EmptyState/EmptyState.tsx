import type { ReactNode } from "react";
import { Card } from "../Card";
import { type CanopHeadingLevel } from "../Heading";
import { EmptyStateContent } from "./EmptyStateContent";
import { EmptyStateFrame } from "./EmptyStateFrame";
import type { CanopEmptyStateSize } from "./emptyStateSizes";
import type { CanopEmptyStateSurface } from "./emptyStateSurface";
import { useEmptyState } from "./useEmptyState";

export type { CanopEmptyStateSize } from "./emptyStateSizes";
export type { CanopEmptyStateSurface } from "./emptyStateSurface";

export interface CanopEmptyStateProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  headingLevel?: CanopHeadingLevel;
  minHeight?: string;
  animated?: boolean;
  surface?: CanopEmptyStateSurface;
  size?: CanopEmptyStateSize;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  headingLevel = 2,
  minHeight,
  animated = true,
  surface = "ambient",
  size = "md",
}: CanopEmptyStateProps) {
  const state = useEmptyState({ size, surface, minHeight, animated });

  const content = (
    <EmptyStateContent
      title={title}
      description={description}
      icon={icon}
      action={action}
      headingLevel={headingLevel}
      recipe={state.recipe}
      choreography={state.choreography}
      illustrationSx={state.illustrationSx}
    />
  );

  return (
    <EmptyStateFrame minHeight={state.minHeight} recipe={state.recipe}>
      {surface === "ambient" ? <Card variant="frosted">{content}</Card> : content}
    </EmptyStateFrame>
  );
}
