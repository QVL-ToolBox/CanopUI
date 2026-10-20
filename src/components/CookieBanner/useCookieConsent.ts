import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import {
  DEFAULT_COOKIE_CONSENT_KEY,
  getStoredConsent,
  setStoredConsent,
  subscribeToConsent,
  type CanopCookieConsent,
} from "./cookieConsent";

export interface CanopCookieConsentState {
  consent: CanopCookieConsent | null;
  decided: boolean;
  accept: () => void;
  decline: () => void;
  reset: () => void;
}

export function useCookieConsent(
  storageKey: string | null = DEFAULT_COOKIE_CONSENT_KEY,
): CanopCookieConsentState {
  const stored = useSyncExternalStore(
    subscribeToConsent,
    () => (storageKey ? getStoredConsent(storageKey) : null),
    () => null,
  );
  const [session, setSession] = useState<CanopCookieConsent | null>(null);

  const decide = useCallback(
    (consent: CanopCookieConsent | null) => {
      if (storageKey) setStoredConsent(storageKey, consent);
      else setSession(consent);
    },
    [storageKey],
  );

  const consent = storageKey ? stored : session;

  return useMemo(
    () => ({
      consent,
      decided: consent !== null,
      accept: () => decide("accepted"),
      decline: () => decide("declined"),
      reset: () => decide(null),
    }),
    [consent, decide],
  );
}
