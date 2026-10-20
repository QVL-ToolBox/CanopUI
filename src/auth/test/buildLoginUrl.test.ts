import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildLoginUrl } from "../navigation";

const ecrits: string[] = [];

beforeEach(() => {
  ecrits.length = 0;
  Object.defineProperty(window, "location", {
    writable: true,
    value: {
      ...window.location,
      href: "https://budgy.qvl.test/transactions?mois=3",
      protocol: "https:",
    },
  });
  vi.spyOn(document, "cookie", "set").mockImplementation((valeur: string) => {
    ecrits.push(valeur);
  });
});

describe("buildLoginUrl", () => {
  it("renvoie l'URL de connexion du portail d'authentification", () => {
    const url = buildLoginUrl({ authPortalUrl: "https://auth.qvl.test" });

    expect(url).toBe("https://auth.qvl.test/login?redirect=1");
  });

  it("depose l'adresse courante dans un cookie, pour y revenir apres", () => {
    buildLoginUrl({ authPortalUrl: "https://auth.qvl.test" });

    expect(ecrits[0]).toContain("ch_redirect=");
    expect(ecrits[0]).toContain(encodeURIComponent("https://budgy.qvl.test/transactions?mois=3"));
    expect(ecrits[0]).toContain("SameSite=Lax");
  });

  it("n'attache aucun domaine par defaut", () => {
    buildLoginUrl({ authPortalUrl: "https://auth.qvl.test" });

    expect(ecrits[0]).not.toContain("domain=");
  });

  it("attache le domaine demande, pour que l'autre sous-domaine lise le cookie", () => {
    buildLoginUrl({
      authPortalUrl: "https://auth.qvl.test",
      redirectCookieDomain: ".qvl.test",
    });

    expect(ecrits[0]).toContain("domain=.qvl.test");
  });

  it("accepte un nom de cookie, une duree et un chemin de connexion", () => {
    const url = buildLoginUrl({
      authPortalUrl: "https://auth.qvl.test",
      loginPath: "/connexion",
      redirectCookieName: "retour",
      redirectCookieMaxAge: 60,
    });

    expect(url).toBe("https://auth.qvl.test/connexion?redirect=1");
    expect(ecrits[0]).toContain("retour=");
    expect(ecrits[0]).toContain("max-age=60");
  });

  it("marque le cookie Secure sur HTTPS", () => {
    buildLoginUrl({ authPortalUrl: "https://auth.qvl.test" });

    expect(ecrits[0]).toContain("; Secure");
  });

  it("ne le marque pas en clair, sinon il ne s'ecrirait pas en local", () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, href: "http://localhost:5173/budgy", protocol: "http:" },
    });

    buildLoginUrl({ authPortalUrl: "http://localhost:5174" });

    expect(ecrits[0]).not.toContain("Secure");
  });
});
