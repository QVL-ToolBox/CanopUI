import { useCallback, useSyncExternalStore } from "react";
import {
  createLocalStore,
  type CanopLocalStore,
  type CanopLocalStoreOptions,
} from "./createLocalStore";

export type CanopLocalStoreSetter<T> = (next: T | ((current: T) => T)) => void;

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

export function persistentStore<T>(options: CanopLocalStoreOptions<T>): CanopLocalStore<T> {
  const existing = registry.get(options.key);
  if (existing) return existing as CanopLocalStore<T>;
  const store = createLocalStore(options);
  registry.set(options.key, store as CanopLocalStore<unknown>);
  return store;
}

export function clearPersistentStores(): void {
  for (const store of registry.values()) store.dispose();
  registry.clear();
}

export function usePersistentState<T>(
  key: string,
  initial: T,
  options?: Omit<CanopLocalStoreOptions<T>, "key" | "initial">,
): [T, CanopLocalStoreSetter<T>] {
  return useLocalStore(persistentStore<T>({ key, initial, ...options }));
}
