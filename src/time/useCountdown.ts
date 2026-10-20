import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCountdownOptions {
  /** Durée totale, en millisecondes. */
  duration: number;
  /** Fait courir l'horloge. Repasser à `false` gèle le temps restant. */
  running?: boolean;
  /** Fréquence de rafraîchissement de l'affichage, en millisecondes. */
  interval?: number;
  /** Appelé une seule fois, quand le temps est épuisé. */
  onEnd?: () => void;
}

export interface UseCountdownResult {
  /** Temps restant, en millisecondes. Jamais négatif. */
  remaining: number;
  /** Temps restant arrondi à la seconde supérieure, pour l'affichage. */
  seconds: number;
  /** Temps écoulé, en millisecondes. */
  elapsed: number;
  /** Part écoulée, de 0 à 1. */
  progress: number;
  ended: boolean;
  /** Repart de la durée pleine. */
  restart: () => void;
}

const DEFAULT_INTERVAL = 100;

/**
 * Un compte à rebours qui ne dérive pas.
 *
 * Le temps restant est **recalculé depuis une échéance absolue**, il n'est
 * jamais décrémenté. Un compte à rebours qui retire une seconde à chaque tick
 * accumule le retard de chaque rendu : soixante secondes affichées en font
 * davantage en vrai, et l'écart grandit avec la charge de la page. Il se
 * trompe aussi lourdement quand l'onglet passe en arrière-plan, où le
 * navigateur bride les minuteries — ici le réveil affiche le temps réellement
 * écoulé, parce que c'est l'horloge qui fait foi, pas le nombre de ticks.
 */
export function useCountdown({
  duration,
  running = false,
  interval = DEFAULT_INTERVAL,
  onEnd,
}: UseCountdownOptions): UseCountdownResult {
  const [remaining, setRemaining] = useState(duration);
  const [epoch, setEpoch] = useState(0);

  const remainingRef = useRef(duration);
  const endedRef = useRef(false);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  const apply = useCallback((value: number) => {
    remainingRef.current = value;
    setRemaining(value);
  }, []);

  useEffect(
    function resetDurationBeforeClockComputesDeadline() {
      endedRef.current = false;
      remainingRef.current = duration;
      setRemaining(duration);
    },
    [duration, epoch],
  );

  useEffect(() => {
    if (!running || remainingRef.current <= 0) return;

    const deadline = Date.now() + remainingRef.current;
    const id = window.setInterval(() => {
      const left = Math.max(0, deadline - Date.now());
      apply(left);
      if (left > 0) return;
      window.clearInterval(id);
      if (endedRef.current) return;
      endedRef.current = true;
      onEndRef.current?.();
    }, interval);

    return () => {
      window.clearInterval(id);
      const exactRemainingNotRoundedToLastTick = Math.max(0, deadline - Date.now());
      apply(exactRemainingNotRoundedToLastTick);
    };
  }, [running, duration, interval, epoch, apply]);

  const restart = useCallback(() => setEpoch((value) => value + 1), []);

  return {
    remaining,
    seconds: Math.ceil(remaining / 1000),
    elapsed: duration - remaining,
    progress: duration > 0 ? (duration - remaining) / duration : 1,
    ended: remaining <= 0,
    restart,
  };
}
