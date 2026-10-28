import MuiCard from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useForkRef } from "@mui/material/utils";
import type { ReactNode, Ref } from "react";
import { LiquidGlassLayers } from "../../liquidGlass/LiquidGlassLayers";
import type { CanopDataAttributes } from "../_shared/dataAttributes";
import { NestedSkeletonScope } from "../Skeleton/NestedSkeletonScope";
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
  ref?: Ref<HTMLDivElement | HTMLAnchorElement>;
  "data-tone"?: never;
  /**
   * Rôle de la carte. `frosted` est un verre liquide à poser sur `CanopyBackground` : teinte
   * translucide de `primary.light` vers `accent.light` à 15 %, sans voile, fond flouté et saturé,
   * liseré spéculaire et ombre interne qui suivent le squircle, sans ombre portée, rayon `xl`,
   * rembourrage `md` puis `xl` dès `md` en densité `auto`. Sous Chromium, les bords réfractent le
   * fond comme une lentille ; ailleurs, même verre sans réfraction ; sans `backdrop-filter`, la
   * teinte repose sur une surface opaque. Le verre garde sa teinte : `tone` n'en change pas le
   * fond. Sans `elevation`, le verre et le contenu sont découpés au squircle ; avec une `elevation`
   * explicite, l'ombre prime et la réfraction est coupée.
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
  /**
   * Réservé à `variant="interactive"` : la carte devient un vrai lien `<a>` (clic molette, nouvel
   * onglet, sémantique de lien). Ne rien y placer d'autre d'activable : ni lien, ni bouton, ni
   * `actions`.
   */
  href?: string;
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
  href,
  ariaLabel,
  children,
  ...dataAttributes
}: CanopCardProps) {
  const rootRef = useForkRef<HTMLDivElement | HTMLAnchorElement>(ref);
  const showsArrow = arrow && variant === "interactive";
  const hasHeader = Boolean(title) || showsArrow;
  const {
    rootSx,
    rootStyle,
    headerSx,
    contentSx,
    actionsSx,
    interactionProps,
    actionsProps,
    liquidGlass,
  } = useCard({
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
    href,
  });

  return (
    <MuiCard
      {...dataAttributes}
      ref={rootRef}
      data-tone={tone}
      elevation={0}
      aria-label={ariaLabel}
      sx={rootSx}
      style={rootStyle}
      {...interactionProps}
    >
      {liquidGlass ? (
        <LiquidGlassLayers
          ref={liquidGlass.ref}
          params={liquidGlass.params}
          radius={liquidGlass.radius}
          filter={liquidGlass.filter}
        />
      ) : null}
      {hasHeader ? (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={showsArrow ? <CardArrow /> : undefined}
          sx={headerSx}
        />
      ) : null}
      <CardContent sx={contentSx}>
        <NestedSkeletonScope surface="card" enabled titled={Boolean(title)}>
          {children}
        </NestedSkeletonScope>
      </CardContent>
      {actions ? (
        <CardActions sx={actionsSx} {...actionsProps}>
          {actions}
        </CardActions>
      ) : null}
    </MuiCard>
  );
}
