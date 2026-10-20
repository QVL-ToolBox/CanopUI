import type { ReactNode } from "react";
import { type CanopHeadingLevel } from "../Heading";
import { ShapeBackground } from "../ShapeBackground";
import { EmptyStateContent } from "./EmptyStateContent";
import { EmptyStatePlainSurface } from "./EmptyStatePlainSurface";

export type CanopEmptyStateSurface = "ambient" | "plain";

export interface CanopEmptyStateProps {
  title: string;
  /**
   * Texte sous le titre, ou n'importe quel noeud : un bandeau d'alerte pour
   * une page d'acces refuse, une liste de pistes a suivre. Une chaine est
   * rendue centree en couleur secondaire.
   */
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  headingLevel?: CanopHeadingLevel;
  minHeight?: string;
  animated?: boolean;
  surface?: CanopEmptyStateSurface;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  headingLevel = 2,
  minHeight = "22rem",
  animated = true,
  surface = "ambient",
}: CanopEmptyStateProps) {
  const content = (
    <EmptyStateContent
      title={title}
      description={description}
      icon={icon}
      action={action}
      headingLevel={headingLevel}
      animated={animated}
    />
  );

  if (surface === "plain") {
    return <EmptyStatePlainSurface minHeight={minHeight}>{content}</EmptyStatePlainSurface>;
  }

  return (
    <ShapeBackground
      variant="ambient"
      intensity={0.7}
      minHeight={minHeight}
      contentSx={{ maxWidth: "32rem", paddingX: "1.5rem" }}
    >
      {content}
    </ShapeBackground>
  );
}
