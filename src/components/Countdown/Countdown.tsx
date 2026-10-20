import Box from "@mui/material/Box";
import { useTranslation } from "../../i18n";
import { useReducedMotion } from "../../motion";
import type { CanopIconName } from "../Icon";
import { ProgressBar, type CanopProgressBarColor } from "../ProgressBar";
import { CountdownTime } from "./CountdownTime";
import { useCountdownDisplay, type CanopCountdownFormat } from "./useCountdownDisplay";

export type { CanopCountdownFormat } from "./useCountdownDisplay";

export interface CanopCountdownProps {
  /** Durée totale, en millisecondes. */
  duration: number;
  /**
   * Fait courir l'horloge. Repasser à `false` gèle le temps restant, à
   * l'instant exact et non au dernier rafraîchissement.
   *
   * Le composant part **en marche**, là où `useCountdown` part à l'arrêt : le
   * hook est une brique qu'on pilote, le composant un affichage qu'on pose.
   */
  running?: boolean;
  /** Appelé une seule fois, quand le temps est épuisé. */
  onEnd?: () => void;
  /**
   * Seuil d'urgence, en secondes restantes : en dessous, le temps bat, passe
   * au rouge et emmène la barre avec lui. `0` désactive le battement et laisse
   * un décompte neutre.
   */
  urgentBelow?: number;
  /**
   * La forme du temps affiché : `"clock"` pour `1:00`, `"seconds"` pour `60`.
   *
   * Par défaut (`"auto"`) c'est la **durée totale** qui tranche, au-delà d'une
   * minute — ce qui laisse une durée d'exactement une minute du côté horloge,
   * et affiche `1:00` puis `0:45` là où l'écran de règles a promis « 60
   * secondes ». Le préfixe `0:` n'y dit alors rien : le chrono ne repassera
   * jamais au-dessus de la minute.
   */
  format?: CanopCountdownFormat;
  /** Couleur de la barre hors urgence. */
  color?: CanopProgressBarColor;
  /** Retire la barre pour ne garder que le temps. */
  showProgress?: boolean;
  icon?: CanopIconName;
  animated?: boolean;
  /** Nom accessible explicite. Prend le pas sur le libellé traduit. */
  ariaLabel?: string;
}

const DEFAULT_URGENT_BELOW = 10;

const URGENT_COLOR: CanopProgressBarColor = "error";

const OFFSCREEN_SX = {
  position: "absolute",
  width: "0.0625rem",
  height: "0.0625rem",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
} as const;

/**
 * Un compte à rebours qui se voit venir.
 *
 * Le temps restant, une barre qui se vide, et un battement sous le seuil
 * d'urgence : c'est ce dernier qui manquait le plus, faute de quoi un jeu se
 * rabat sur un état statique — icône rouge, texte rouge — qui ne dit pas que
 * le temps presse, seulement qu'il est court.
 *
 * L'horloge est celle de `useCountdown`, recalculée depuis une échéance
 * absolue : elle ne dérive pas et survit à un onglet mis en arrière-plan.
 * Pour repartir sur une nouvelle question, remonter le composant avec une
 * `key` — c'est le seul moyen de redémarrer une durée identique.
 */
export function Countdown({
  duration,
  running = true,
  onEnd,
  urgentBelow = DEFAULT_URGENT_BELOW,
  format = "auto",
  color = "primary",
  showProgress = true,
  icon = "timer",
  animated = true,
  ariaLabel,
}: CanopCountdownProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const { seconds, text, percentage, urgent, beating } = useCountdownDisplay({
    duration,
    running,
    format,
    urgentBelow,
    beat: animated && !reduced,
    onEnd,
  });

  return (
    <Box
      role="timer"
      aria-label={ariaLabel ?? t("canop.countdown.label", { seconds })}
      sx={{ position: "relative", width: "100%" }}
    >
      <Box
        aria-hidden
        sx={{ display: "flex", flexDirection: "column", gap: "0.375rem", width: "100%" }}
      >
        <CountdownTime
          text={text}
          icon={icon}
          urgent={urgent}
          beating={beating}
          animated={animated}
        />
        {showProgress && (
          <ProgressBar
            value={percentage}
            color={urgent ? URGENT_COLOR : color}
            animated={animated}
          />
        )}
      </Box>
      <Box component="span" aria-live="polite" sx={OFFSCREEN_SX}>
        {urgent ? t("canop.countdown.urgent", { seconds: urgentBelow }) : ""}
      </Box>
    </Box>
  );
}
