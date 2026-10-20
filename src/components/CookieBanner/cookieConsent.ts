import { attemptStorage } from "../../storage/attemptStorage";

export type CanopCookieConsent = "accepted" | "declined";

export const DEFAULT_COOKIE_CONSENT_KEY = "canop-cookie-consent";

const listeners = new Set<() => void>();
const snapshots = new Map<string, CanopCookieConsent | null>();

function parse(value: string | null | undefined): CanopCookieConsent | null {
  return value === "accepted" || value === "declined" ? value : null;
}

function readStorage(key: string): CanopCookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    return parse(window.localStorage?.getItem(key));
  } catch {
    return null;
  }
}

function notify(): void {
  for (const listener of [...listeners]) listener();
}

function onStorage(event: StorageEvent): void {
  if (event.key === null) {
    snapshots.clear();
    notify();
    return;
  }
  if (!snapshots.has(event.key)) return;
  snapshots.set(event.key, parse(event.newValue));
  notify();
}

export function getStoredConsent(
  key: string = DEFAULT_COOKIE_CONSENT_KEY,
): CanopCookieConsent | null {
  if (!snapshots.has(key)) snapshots.set(key, readStorage(key));
  return snapshots.get(key) ?? null;
}

export function setStoredConsent(key: string, consent: CanopCookieConsent | null): void {
  snapshots.set(key, consent);
  if (typeof window !== "undefined") {
    attemptStorage(() => {
      if (consent) window.localStorage?.setItem(key, consent);
      else window.localStorage?.removeItem(key);
    });
  }
  notify();
}

export function subscribeToConsent(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1 && typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}
