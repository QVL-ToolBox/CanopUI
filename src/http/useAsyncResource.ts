import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAsyncResourceOptions<T> {
  /**
   * Charge la ressource. Recoit un signal a passer au client HTTP pour que la
   * requete soit reellement abandonnee, et non seulement ignoree.
   */
  load: (signal: AbortSignal) => Promise<T>;
  /** Valeur servie avant le premier chargement, et jamais remplacee par `null`. */
  initial: T;
  /** Traduit une erreur en message affichable. A defaut, l'erreur est tue. */
  toMessage?: (error: unknown) => string;
  /** Coupe le chargement automatique : la ressource n'est lue qu'a `reload()`. */
  enabled?: boolean;
}

export interface UseAsyncResourceResult<T> {
  data: T;
  loading: boolean;
  /** Message d'erreur affichable, ou `null`. */
  error: string | null;
  /** Vrai des qu'un chargement a echoue, meme sans message. */
  failed: boolean;
  reload: () => void;
}

/**
 * Charge une ressource distante : etat de chargement, erreur, rechargement.
 *
 * Ce hook existe parce que chaque application le reecrivait, et que les copies
 * avaient **deja divergé** : trois conventions d'erreur -- une chaine, un
 * booleen, une chaine nommee autrement -- et trois facons de traiter
 * l'annulation, dont une seule correcte. Les deux sont ici tranchees une fois.
 *
 * **L'annulation passe par un `AbortSignal`, pas par un drapeau.** Une garde
 * `let active = true` empeche bien d'ecrire dans un composant demonte, mais la
 * requete continue : sur une liste ou l'on change de filtre vite, les reponses
 * s'empilent et la derniere arrivee n'est pas la derniere demandee. Le signal,
 * lui, abandonne vraiment la requete, et l'ordre est garanti.
 *
 * `data` ne repasse jamais a une valeur vide sur erreur : garder l'affichage
 * precedent et signaler l'echec a cote vaut mieux qu'un ecran qui se vide.
 */
export function useAsyncResource<T>({
  load,
  initial,
  toMessage,
  enabled = true,
}: UseAsyncResourceOptions<T>): UseAsyncResourceResult<T> {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [tick, setTick] = useState(0);

  const derniersRappelsSansRelance = useRef({ load, toMessage });
  useEffect(() => {
    derniersRappelsSansRelance.current = { load, toMessage };
  });

  useEffect(() => {
    if (!enabled) return;
    const controleur = new AbortController();
    setLoading(true);
    setError(null);
    derniersRappelsSansRelance.current
      .load(controleur.signal)
      .then((valeur) => {
        if (controleur.signal.aborted) return;
        setData(valeur);
        setFailed(false);
        setLoading(false);
      })
      .catch((cause: unknown) => {
        if (controleur.signal.aborted) return;
        setFailed(true);
        setError(derniersRappelsSansRelance.current.toMessage?.(cause) ?? null);
        setLoading(false);
      });
    return () => controleur.abort();
  }, [enabled, tick]);

  const reload = useCallback(() => setTick((valeur) => valeur + 1), []);

  return { data, loading, error, failed, reload };
}
