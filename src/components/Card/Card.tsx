import MuiCard from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import type { ReactNode, Ref } from "react";
import type { CanopDataAttributes } from "../_shared/dataAttributes";
import { CardArrow } from "./CardArrow";
import {
  useCard,
  type CanopCardDensity,
  type CanopCardElevation,
  type CanopCardFlash,
  type CanopCardRadius,
  type CanopCardTone,
  type CanopCardVariant,
} from "./useCard";

export type {
  CanopCardDensity,
  CanopCardElevation,
  CanopCardFlash,
  CanopCardRadius,
  CanopCardTone,
  CanopCardVariant,
};

export interface CanopCardProps extends CanopDataAttributes {
  ref?: Ref<HTMLDivElement>;
  "data-tone"?: never;
  /**
   * Rôle de la carte. `frosted` est un verre dépoli à poser sur `CanopyBackground` : dégradé
   * translucide de `primary.light` et `accent.light` sur un voile de `surface.base` à 33 %, fond
   * flouté, sans ombre, rayon `xl`, rembourrage `md` puis `xl` dès `md` en densité `auto`, et repli
   * opaque sans `backdrop-filter`. Le verre garde sa teinte : `tone` n'en change pas le fond.
   */
  variant?: CanopCardVariant;
  /** Tonalite semantique de la surface : ce que la valeur signifie. */
  tone?: CanopCardTone;
  /** Retour immediat, le temps d'etre vu : bonne ou mauvaise reponse. */
  flash?: CanopCardFlash;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  radius?: CanopCardRadius;
  density?: CanopCardDensity;
  elevation?: CanopCardElevation;
  fill?: boolean;
  /** Flèche d'en-tête réservée à `variant="interactive"` : ignorée sur toute autre variante. */
  arrow?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  children: ReactNode;
}

export function Card({
  ref,
  variant = "surface",
  tone = "neutral",
  flash,
  title,
  subtitle,
  actions,
  radius,
  density = "auto",
  elevation,
  fill = false,
  arrow = false,
  onClick,
  ariaLabel,
  children,
  ...dataAttributes
}: CanopCardProps) {
  const showsArrow = arrow && variant === "interactive";
  const hasHeader = Boolean(title) || showsArrow;
  const { rootSx, headerSx, contentSx, actionsSx, interactionProps, actionsProps } = useCard({
    variant,
    tone,
    flash,
    elevation,
    radius,
    density,
    fill,
    arrow: showsArrow,
    hasHeader,
    onClick,
  });

  return (
    <MuiCard
      {...dataAttributes}
      ref={ref}
      data-tone={tone}
      elevation={0}
      aria-label={ariaLabel}
      sx={rootSx}
      {...interactionProps}
    >
      {hasHeader ? (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={showsArrow ? <CardArrow /> : undefined}
          sx={headerSx}
        />
      ) : null}
      <CardContent sx={contentSx}>{children}</CardContent>
      {actions ? (
        <CardActions sx={actionsSx} {...actionsProps}>
          {actions}
        </CardActions>
      ) : null}
    </MuiCard>
  );
}
