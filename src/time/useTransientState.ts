import { useCallback, useEffect, useRef, useState } from "react";

export interface UseTransientStateOptions {
  /** Durée avant le retour au repos, en millisecondes. */
  duration?: number;
  /**
   * Appelé quand la valeur **est revenue d'elle-même** au repos.
   *
   * Sans lui, le hook sait poser une valeur qui s'efface mais pas dire *quand* :
   * un appelant qui doit enchaîner sur la suite — passer à la question
   * suivante après l'éclair de correction — n'a d'autre choix que de reposer un
   * `setTimeout` de la même durée à côté, exactement la plomberie que ce hook
   * existe pour supprimer. Deux minuteries pour un seul moment, qui dérivent
   * dès que la durée est donnée à l'appel.
   *
   * `clear()` ne le déclenche **pas** : c'est un retour au repos demandé, dont
   * l'appelant est déjà l'auteur. Seule l'échéance parle.
   */
  onSettle?: () => void;
}

export interface UseTransientStateResult<T> {
  value: T;
  /**
   * Pose une valeur, qui s'effacera d'elle-même.
   *
   * La durée peut être donnée à l'appel : c'est ce qui permet à un même éclair
   * de durer moins longtemps sur une réussite que sur une erreur, où il faut
   * laisser le temps de lire la bonne réponse.
   */
  show: (value: T, duration?: number) => void;
  /** Ramène au repos immédiatement. */
  clear: () => void;
}

const DEFAULT_DURATION = 1600;

/**
 * Une valeur qui revient d'elle-même à son état de repos.
 *
 * Le motif est partout — un éclair de bonne réponse, un « copié ! », un
 * message qui s'efface — et il est presque toujours écrit à la main avec un
 * `setTimeout` nu. Deux défauts en découlent, que ce hook ferme.
 *
 * La minuterie précédente est **remplacée** à chaque appel : sans ça deux
 * déclenchements rapprochés empilent leurs minuteries, et la première remet au
 * repos pendant que la seconde est censée être visible. Et elle est **annulée
 * au démontage** : sans ça une minuterie posée pendant une partie continue de
 * courir après la fin, et vient écrire dans un écran qui n'existe plus.
 */
export function useTransientState<T>(
  resting: T,
  options: UseTransientStateOptions = {},
): UseTransientStateResult<T> {
  const { duration = DEFAULT_DURATION, onSettle } = options;

  const [value, setValue] = useState<T>(resting);
  const timer = useRef<number | null>(null);
  const restingRef = useRef(resting);
  restingRef.current = resting;

  const onSettleReadAtDeadlineRef = useRef(onSettle);
  onSettleReadAtDeadlineRef.current = onSettle;

  const cancel = useCallback(() => {
    if (timer.current === null) return;
    window.clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => cancel, [cancel]);

  const show = useCallback(
    (next: T, override?: number) => {
      cancel();
      setValue(next);
      timer.current = window.setTimeout(() => {
        timer.current = null;
        setValue(restingRef.current);
        onSettleReadAtDeadlineRef.current?.();
      }, override ?? duration);
    },
    [cancel, duration],
  );

  const clear = useCallback(() => {
    cancel();
    setValue(restingRef.current);
  }, [cancel]);

  return { value, show, clear };
}
