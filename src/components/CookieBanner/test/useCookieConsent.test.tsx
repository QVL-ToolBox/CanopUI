import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { DEFAULT_COOKIE_CONSENT_KEY, setStoredConsent } from "../cookieConsent";
import { useCookieConsent } from "../useCookieConsent";

describe("useCookieConsent", () => {
  beforeEach(() => {
    setStoredConsent(DEFAULT_COOKIE_CONSENT_KEY, null);
  });

  it("part sans decision", () => {
    const { result } = renderHook(() => useCookieConsent());

    expect(result.current.consent).toBeNull();
    expect(result.current.decided).toBe(false);
  });

  it("enregistre la decision et la relit", () => {
    const { result } = renderHook(() => useCookieConsent());

    act(() => result.current.accept());

    expect(result.current.consent).toBe("accepted");
    expect(result.current.decided).toBe(true);
    expect(window.localStorage.getItem(DEFAULT_COOKIE_CONSENT_KEY)).toBe("accepted");
  });

  it("efface la decision avec reset", () => {
    setStoredConsent(DEFAULT_COOKIE_CONSENT_KEY, "accepted");
    const { result } = renderHook(() => useCookieConsent());

    act(() => result.current.reset());

    expect(result.current.decided).toBe(false);
    expect(window.localStorage.getItem(DEFAULT_COOKIE_CONSENT_KEY)).toBeNull();
  });

  it("synchronise deux consommateurs de la meme cle", () => {
    const banniere = renderHook(() => useCookieConsent());
    const mesure = renderHook(() => useCookieConsent());

    act(() => banniere.result.current.decline());

    expect(mesure.result.current.consent).toBe("declined");
  });

  it("isole les cles distinctes", () => {
    const defaut = renderHook(() => useCookieConsent());
    const autre = renderHook(() => useCookieConsent("portail-mesure"));

    act(() => defaut.result.current.accept());

    expect(autre.result.current.consent).toBeNull();
    setStoredConsent("portail-mesure", null);
  });

  it("garde la decision en memoire quand storageKey vaut null", () => {
    const { result } = renderHook(() => useCookieConsent(null));

    act(() => result.current.accept());

    expect(result.current.consent).toBe("accepted");
    expect(window.localStorage.getItem(DEFAULT_COOKIE_CONSENT_KEY)).toBeNull();
  });
});
