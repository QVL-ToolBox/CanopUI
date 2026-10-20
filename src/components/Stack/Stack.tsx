import Box from "@mui/material/Box";
import type { FormEventHandler, ReactNode, Ref } from "react";
import { tokens } from "../../tokens";
import type { CanopDataAttributes } from "../_shared/dataAttributes";

export type CanopStackGap = "xs" | "sm" | "md" | "lg" | "xl";
export type CanopStackElement = "div" | "form" | "nav" | "section";
export type CanopStackDirection = "row" | "column";
export type CanopStackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type CanopStackJustify =
  "start" | "center" | "end" | "space-between" | "space-around" | "space-evenly";
export type CanopStackPadding = CanopStackGap | "none";
export type CanopStackSticky = "top" | "bottom";

const alignMap: Record<CanopStackAlign, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};

const justifyMap: Record<CanopStackJustify, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  "space-between": "space-between",
  "space-around": "space-around",
  "space-evenly": "space-evenly",
};

export type CanopStackRole =
  "group" | "radiogroup" | "toolbar" | "list" | "listitem" | "presentation" | "none";

export interface CanopStackProps extends CanopDataAttributes {
  ref?: Ref<HTMLElement>;
  ariaBusy?: boolean;
  gap?: CanopStackGap;
  direction?: CanopStackDirection;
  alignItems?: CanopStackAlign;
  justifyContent?: CanopStackJustify;
  wrap?: boolean;
  padding?: CanopStackPadding;
  as?: CanopStackElement;
  ariaLabel?: string;
  /**
   * Role ARIA du conteneur, pour les groupes qui en ont un : `radiogroup`,
   * `group`, `toolbar`, `list`. Sans lui, un groupe de choix construit avec
   * `Pressable` ne s'annonce pas comme un groupe, et il faut sortir de la
   * librairie pour le corriger.
   */
  role?: CanopStackRole;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  fill?: boolean;
  /**
   * Part de l'espace que ce `Stack` prend parmi ses frères, relative à la
   * leur : deux colonnes en `2` et `1` occupent deux tiers et un tiers.
   *
   * `fill` seul ne sait faire que des parts égales, puisqu'il vaut
   * `flex: 1 1 0%` pour tout le monde. Rien d'autre dans la librairie ne
   * partage une ligne autrement : `CardGrid` n'aligne que des colonnes
   * strictement égales. Restait à laisser chaque colonne en `flex: 0 1 auto`,
   * et sa largeur suivait alors le `max-content` de son contenu — un panneau
   * titré « Ain » et « Alpes-de-Haute-Provence » tour à tour se redimensionne
   * à chaque changement, et déplace tout ce qui l'entoure.
   *
   * La base reste donc à `0%`, comme pour `fill` : les largeurs sont un pur
   * rapport, insensible au contenu. Poser `weight` suffit — inutile d'ajouter
   * `fill`, qui ne ferait que redire la même chose.
   */
  weight?: number;
  /**
   * Colle le bloc au haut ou au bas de la **zone défilante** qui le contient,
   * dès que le défilement l'y amène.
   *
   * La zone défilante est `PageContent` — c'est elle qui porte l'`overflowY`.
   * Un bloc collé à l'intérieur d'un `PageContent` en `fillHeight` ne bougera
   * donc jamais : cette variante est en `overflow: hidden`, rien n'y défile.
   *
   * `sticky` ne se combine ni avec `fill` ni avec `weight` : ceux-ci posent
   * `flex: 1 1 0%`, donc le bloc occupe toute la hauteur de son parent et n'a
   * plus aucune course à parcourir.
   */
  sticky?: CanopStackSticky;
  /**
   * La distance entre le bloc collé et le bord, sur l'échelle d'espacement.
   * Sans effet hors `sticky`.
   */
  stickyOffset?: CanopStackPadding;
  children: ReactNode;
}

const STICKY_LAYER_ABOVE_SCROLLING_SIBLINGS = 1;

export function Stack({
  ref,
  ariaBusy,
  gap = "md",
  direction = "column",
  alignItems,
  justifyContent,
  wrap = false,
  padding = "none",
  as = "div",
  ariaLabel,
  role,
  onSubmit,
  fill = false,
  weight,
  sticky,
  stickyOffset = "none",
  children,
  ...dataAttributes
}: CanopStackProps) {
  const shares = fill || weight !== undefined;
  const edgeOffset = stickyOffset === "none" ? 0 : tokens.spacing[stickyOffset];
  const stick = sticky
    ? {
        position: "sticky" as const,
        top: sticky === "top" ? edgeOffset : undefined,
        bottom: sticky === "bottom" ? edgeOffset : undefined,
        zIndex: STICKY_LAYER_ABOVE_SCROLLING_SIBLINGS,
      }
    : {};
  return (
    <Box
      {...dataAttributes}
      ref={ref}
      component={as}
      aria-label={ariaLabel}
      aria-busy={ariaBusy}
      role={role}
      onSubmit={onSubmit}
      sx={{
        ...(shares ? { flex: `${weight ?? 1} 1 0%`, minHeight: 0 } : {}),
        ...stick,
        minWidth: 0,
        display: "flex",
        flexDirection: direction,
        flexWrap: wrap ? "wrap" : "nowrap",
        gap: tokens.spacing[gap],
        alignItems: alignItems ? alignMap[alignItems] : undefined,
        justifyContent: justifyContent ? justifyMap[justifyContent] : undefined,
        padding: padding === "none" ? undefined : tokens.spacing[padding],
      }}
    >
      {children}
    </Box>
  );
}
