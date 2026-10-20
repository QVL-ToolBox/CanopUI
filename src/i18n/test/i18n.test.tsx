import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopI18nProvider } from "../CanopI18nProvider";
import { useTranslation, interpolate } from "../CanopI18nContext";
import type { CanopLocaleMessages } from "../messages";

function Probe({ k, vars }: { k: string; vars?: Record<string, string | number> }) {
  const { t, locale } = useTranslation();
  return (
    <>
      <span data-testid="locale">{locale}</span>
      <span data-testid="value">{t(k, vars)}</span>
    </>
  );
}

describe("i18n", () => {
  it("interpole les variables {nom}", () => {
    expect(interpolate("min {min} caractères", { min: 8 })).toBe("min 8 caractères");
  });

  it("fournit les messages de base de la lib en français par défaut", () => {
    render(<Probe k="canop.validation.required" />);
    expect(screen.getByTestId("value")).toHaveTextContent("Ce champ est requis.");
  });

  it("bascule de locale et applique les messages anglais", () => {
    render(
      <CanopI18nProvider locale="en">
        <Probe k="canop.themeToggle.dark" />
      </CanopI18nProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("en");
    expect(screen.getByTestId("value")).toHaveTextContent("Dark theme");
  });

  it("fusionne et surcharge avec les messages de l'application", () => {
    render(
      <CanopI18nProvider locale="fr" messages={{ fr: { "app.title": "Connexion à {portal}" } }}>
        <Probe k="app.title" vars={{ portal: "CustHome" }} />
      </CanopI18nProvider>,
    );
    expect(screen.getByTestId("value")).toHaveTextContent("Connexion à CustHome");
  });

  it("retourne la clé brute si absente", () => {
    render(<Probe k="cle.inconnue" />);
    expect(screen.getByTestId("value")).toHaveTextContent("cle.inconnue");
  });
});

describe("CanopI18nProvider — lecture du stockage", () => {
  const messages: CanopLocaleMessages = { fr: {}, en: {} };

  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retient la locale stockée sous la clé courante", () => {
    window.localStorage.setItem("canop-locale", "en");
    render(
      <CanopI18nProvider messages={messages}>
        <Probe k="canop.language.label" />
      </CanopI18nProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("en");
  });

  it("retombe sur la locale par défaut quand le stockage est vide", () => {
    render(
      <CanopI18nProvider messages={messages}>
        <Probe k="canop.language.label" />
      </CanopI18nProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("fr");
    expect(window.localStorage.getItem("canop-locale")).toBeNull();
  });

  it("retombe sur la locale par défaut quand la lecture du stockage lève", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("stockage indisponible");
    });
    render(
      <CanopI18nProvider messages={messages}>
        <Probe k="canop.language.label" />
      </CanopI18nProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("fr");
  });
});
