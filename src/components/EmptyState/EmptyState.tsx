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
  /**
   * `ambient` pose le contenu dans une `Card` en verre liquide, pour un etat
   * vide seul sur sa page. `plain` n'a aucune surface et se fond dans son
   * conteneur : a utiliser dans une carte, un tableau ou une zone deja peinte.
   */
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
