import ButtonBase from "@mui/material/ButtonBase";
import type { ElementType, ReactNode } from "react";
import {
  usePressable,
  type CanopPressableRadius,
  type CanopPressableSpacing,
} from "./usePressable";

export type { CanopPressableRadius, CanopPressableSpacing };

export type CanopPressableRole = "button" | "radio" | "checkbox" | "tab" | "option" | "switch";

export interface CanopPressableProps {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Rayon du squircle, ou `circle` pour un disque parfait. */
  radius?: CanopPressableRadius;
  /** Cote d'une surface carree, par exemple une pastille : `2.25rem`. */
  size?: string;
  /** Couleur de fond. Une surface cliquable qui porte une couleur est son propos. */
  background?: string;
  padding?: CanopPressableSpacing;
  /** Entoure la surface d'un lisere et la grossit legerement. */
  selected?: boolean;
  /**
   * Attenue la surface quand elle est desactivee.
   *
   * A passer a `false` quand le verrouillage sert a **montrer** quelque chose
   * plutot qu'a l'ecarter : une reponse dont le verdict vient de tomber perd
   * sinon sa teinte et sa marque a l'instant meme de la revelation.
   */
  dimWhenDisabled?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
  role?: CanopPressableRole;
  ariaChecked?: boolean;
  ariaPressed?: boolean;
  as?: ElementType;
}

/**
 * Une surface cliquable **sans apparence** : elle apporte la forme en
 * squircle, l'etat de selection et l'accessibilite, et
 * laisse son contenu libre.
 *
 * C'est la piece qui manquait pour que les portails n'aient plus a importer
 * `ButtonBase` de MUI directement : une pastille de couleur, une tuile de
 * galerie ou un choix d'icone ne sont pas des boutons au sens de `Button`,
 * qui impose un libelle et une variante.
 *
 * Pour une action avec un libelle, utiliser `Button`. Pour une action portee
 * par une seule icone, `IconActionButton`.
 */
export function Pressable({
  children,
  onClick,
  disabled = false,
  radius = "md",
  size,
  background,
  padding = "none",
  selected = false,
  dimWhenDisabled = true,
  fullWidth = false,
  ariaLabel,
  role,
  ariaChecked,
  ariaPressed,
  as,
}: CanopPressableProps) {
  const { rootSx } = usePressable({
    radius,
    padding,
    size,
    background,
    selected,
    fullWidth,
    disabled,
    dimWhenDisabled,
  });

  return (
    <ButtonBase
      component={as ?? "button"}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      role={role}
      aria-checked={ariaChecked}
      aria-pressed={ariaPressed}
      sx={rootSx}
    >
      {children}
    </ButtonBase>
  );
}
