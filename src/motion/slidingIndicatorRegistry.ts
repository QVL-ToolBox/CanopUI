import { createContext } from "react";

export interface SlidingIndicatorEntry {
  anchor: HTMLElement;
  pill: HTMLElement;
}

export interface SlidingIndicatorGroupStore {
  mounted: SlidingIndicatorEntry[];
  last: HTMLElement | null;
  lastPill: HTMLElement | null;
  departedPill: DOMRect | null;
}

export const SlidingIndicatorGroupContext = createContext<SlidingIndicatorGroupStore | null>(null);

export function createSlidingIndicatorGroupStore(): SlidingIndicatorGroupStore {
  return { mounted: [], last: null, lastPill: null, departedPill: null };
}

function visiblePillRect(store: SlidingIndicatorGroupStore): DOMRect | null {
  if (store.lastPill?.isConnected) return store.lastPill.getBoundingClientRect();
  return store.departedPill;
}

function sourceRect(store: SlidingIndicatorGroupStore, anchor: HTMLElement): DOMRect | null {
  const { last } = store;
  if (!last || last === anchor) return null;
  const pillRect = visiblePillRect(store);
  if (pillRect) return pillRect;
  return last.isConnected ? last.getBoundingClientRect() : null;
}

function rememberDepartedPill(store: SlidingIndicatorGroupStore, pill: HTMLElement): void {
  if (store.lastPill !== pill || !pill.isConnected) return;
  const departed = pill.getBoundingClientRect();
  store.departedPill = departed;
  queueMicrotask(() => {
    if (store.departedPill === departed) store.departedPill = null;
  });
}

export function enterSlidingIndicatorGroup(
  store: SlidingIndicatorGroupStore,
  entry: SlidingIndicatorEntry,
): DOMRect | null {
  const source = sourceRect(store, entry.anchor);
  store.mounted.push(entry);
  store.last = entry.anchor;
  store.lastPill = entry.pill;
  store.departedPill = null;
  return source;
}

export function leaveSlidingIndicatorGroup(
  store: SlidingIndicatorGroupStore,
  entry: SlidingIndicatorEntry,
): void {
  rememberDepartedPill(store, entry.pill);
  store.mounted = store.mounted.filter((mounted) => mounted.anchor !== entry.anchor);
  const remaining = store.mounted.at(-1);
  store.last = remaining?.anchor ?? entry.anchor;
  store.lastPill = remaining?.pill ?? entry.pill;
}
