import Box from "@mui/material/Box";
import { useTranslation } from "../../i18n";
import { useReducedMotion } from "../../motion";
import type { CanopIconName, CanopIconSize } from "../Icon";
import { LivesHeart } from "./LivesHeart";
import { useLives } from "./useLives";

export interface CanopLivesProps {
  /** Vies restantes. */
  value: number;
  /** Vies au départ. */
  max: number;
  icon?: CanopIconName;
  size?: CanopIconSize;
  /**
   * Fond la couleur et fait battre le cœur qui s'éteint.
   *
   * Perdre une vie est l'évènement le plus marquant d'une partie : sans
   * transition, il se réduit à un tracé qui change d'un rendu à l'autre, et il
   * passe inaperçu quand le regard est ailleurs.
   */
  animated?: boolean;
  /** Nom accessible explicite. Prend le pas sur le libellé traduit. */
  ariaLabel?: string;
}

/**
 * Les vies restantes d'une partie.
 *
 * Le dessin est décoratif, le texte ne l'est pas : le compte est annoncé aux
 * lecteurs d'écran en toutes lettres, parce qu'une rangée de cœurs ne dit rien
 * à qui ne la voit pas. Les icônes elles-mêmes sont donc masquées de l'arbre
 * d'accessibilité, et le conteneur porte le compte.
 */
export function Lives({
  value,
  max,
  icon = "heart",
  size = "sm",
  animated = true,
  ariaLabel,
}: CanopLivesProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const play = animated && !reduced;
  const { remaining, cells, fading } = useLives(value, max, play);

  return (
    <Box
      role="img"
      aria-label={ariaLabel ?? t("canop.lives.label", { count: remaining, max })}
      sx={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
    >
      {cells.map((filled, index) => (
        <LivesHeart
          key={index}
          icon={icon}
          size={size}
          filled={filled}
          fading={fading === index}
          animated={play}
        />
      ))}
    </Box>
  );
}
