import { useCallback, useSyncExternalStore } from "react";
import {
  createLocalStore,
  type CanopLocalStore,
  type CanopLocalStoreOptions,
} from "./createLocalStore";

export type CanopLocalStoreSetter<T> = (next: T | ((current: T) => T)) => void;

/**
 * Branche un magasin à React.
 *
 * `useSyncExternalStore` et non un `useState` recopié : deux composants qui
 * lisent le même magasin voient la même valeur au même rendu, et un écrit dans
 * un autre onglet arrive sans qu'ils aient à se remonter.
 */
export function useLocalStore<T>(store: CanopLocalStore<T>): [T, CanopLocalStoreSetter<T>] {
  const value = useSyncExternalStore(store.subscribe, store.get, store.get);
  const set = useCallback<CanopLocalStoreSetter<T>>(
    (next) => {
      store.set(next);
    },
    [store],
  );
  return [value, set];
}

const registry = new Map<string, CanopLocalStore<unknown>>();

/**
 * Un magasin par clé, partagé par tous ceux qui la demandent.
 *
 * Sans ce registre, deux composants appelant `usePersistentState("son")`
 * tiendraient chacun leur copie et divergeraient au premier écrit — le même
 * défaut que la coupure du son avant qu'elle entre dans un provider.
 *
 * La première déclaration d'une clé fixe sa valeur initiale et sa version :
 * les suivantes la rejoignent.
 */
export function persistentStore<T>(options: CanopLocalStoreOptions<T>): CanopLocalStore<T> {
  const existing = registry.get(options.key);
  if (existing) return existing as CanopLocalStore<T>;
  const store = createLocalStore(options);
  registry.set(options.key, store as CanopLocalStore<unknown>);
  return store;
}

/** Vide le registre. Réservé aux tests. */
export function clearPersistentStores(): void {
  for (const store of registry.values()) store.dispose();
  registry.clear();
}

/**
 * Une valeur retenue d'une visite à l'autre, à la manière de `useState`.
 *
 * Pour un état structuré et versionné, préférer `createLocalStore` et
 * `useLocalStore`, qui exposent la migration.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
  options?: Omit<CanopLocalStoreOptions<T>, "key" | "initial">,
): [T, CanopLocalStoreSetter<T>] {
  return useLocalStore(persistentStore<T>({ key, initial, ...options }));
}
