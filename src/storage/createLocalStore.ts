import { attemptStorage } from "./attemptStorage";

export interface CanopLocalStoreOptions<T> {
  /** Clé de stockage. */
  key: string;
  /** Version du schéma. Un changement déclenche `migrate`. */
  version?: number;
  initial: T;
  /**
   * Reprend une sauvegarde écrite sous une version antérieure.
   *
   * Reçoit la charge telle qu'elle a été lue et la version dont elle vient —
   * `0` pour une sauvegarde écrite avant toute numérotation. Retourner `null`
   * repart de `initial`, ce qui vaut mieux qu'un écran nourri de données dont
   * la forme a changé.
   */
  migrate?: (stored: unknown, version: number) => T | null;
  /** Support de persistance, ou `null` pour ne rien retenir. */
  storage?: Storage | null;
}

export interface CanopLocalStore<T> {
  /**
   * L'état courant, gardé en mémoire.
   *
   * Aucune relecture du stockage : c'est le point. Une lecture qui reparse à
   * chaque appel se paie au centuple dès qu'elle passe dans une boucle — un
   * tirage pondéré sur 101 entrées relisait 101 fois la même sauvegarde.
   */
  get: () => T;
  set: (next: T | ((current: T) => T)) => T;
  /** Revient à `initial` et efface la sauvegarde. */
  reset: () => T;
  /** Prévient à chaque changement, y compris ceux venus d'un autre onglet. */
  subscribe: (listener: () => void) => () => void;
  /** Détache l'écoute inter-onglets. */
  dispose: () => void;
}

const UNVERSIONED_SAVE_VERSION = 0;

interface Payload {
  v: number;
  d: unknown;
}

function isPayload(value: unknown): value is Payload {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Payload).v === "number" &&
    "d" in value
  );
}

function defaultStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function createLocalStore<T>(options: CanopLocalStoreOptions<T>): CanopLocalStore<T> {
  const { key, version = 1, initial, migrate } = options;
  const storage = options.storage === undefined ? defaultStorage() : options.storage;

  const listeners = new Set<() => void>();

  function read(): T {
    if (!storage) return initial;
    let raw: string | null;
    try {
      raw = storage.getItem(key);
    } catch {
      return initial;
    }
    if (raw === null) return initial;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return initial;
    }

    const storedVersion = isPayload(parsed) ? parsed.v : UNVERSIONED_SAVE_VERSION;
    const payload = isPayload(parsed) ? parsed.d : parsed;

    if (storedVersion === version) return payload as T;
    if (migrate) {
      try {
        return migrate(payload, storedVersion) ?? initial;
      } catch {
        return initial;
      }
    }
    return initial;
  }

  function write(value: T): void {
    if (!storage) return;
    attemptStorage(() => storage.setItem(key, JSON.stringify({ v: version, d: value })));
  }

  let current = read();

  function notify(): void {
    for (const listener of [...listeners]) listener();
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== key) return;
    if (event.storageArea && storage && event.storageArea !== storage) return;
    current = read();
    notify();
  };

  if (typeof window !== "undefined" && storage) {
    window.addEventListener("storage", onStorage);
  }

  return {
    get: () => current,

    set(next) {
      const value = typeof next === "function" ? (next as (current: T) => T)(current) : next;
      if (Object.is(value, current)) return current;
      current = value;
      write(value);
      notify();
      return value;
    },

    reset() {
      current = initial;
      if (storage) {
        attemptStorage(() => storage.removeItem(key));
      }
      notify();
      return current;
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    dispose() {
      listeners.clear();
      if (typeof window !== "undefined" && storage) {
        window.removeEventListener("storage", onStorage);
      }
    },
  };
}
