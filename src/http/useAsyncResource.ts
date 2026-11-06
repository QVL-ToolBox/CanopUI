import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAsyncResourceOptions<T> {
  load: (signal: AbortSignal) => Promise<T>;
  initial: T;
  toMessage?: (error: unknown) => string;
  enabled?: boolean;
}

export interface UseAsyncResourceResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
  failed: boolean;
  reload: () => void;
}

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
