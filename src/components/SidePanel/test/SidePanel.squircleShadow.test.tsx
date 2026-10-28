import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { SidePanel } from "../SidePanel";
import {
  elementsDecoupesEtOmbres,
  estDecoupeEnSquircle,
  porteUnDropShadow,
  porteUnFond,
  porteUnOverflowMasque,
} from "../../../test/squircleShadowKit";

const matchMediaOriginal = window.matchMedia;

function simulerViewport(etroit: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: etroit && query.includes("max-width"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function ouvrirPanneau(mode: "light" | "dark") {
  render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider mode={mode}>
        <SidePanel open onClose={vi.fn()} title="Modifier">
          <p>Contenu du panneau</p>
        </SidePanel>
      </CanopThemeProvider>
    </CanopI18nProvider>,
  );
  const contenu = screen.getByText("Contenu du panneau");
  let anime: HTMLElement | null = contenu.parentElement;
  while (anime && !/translate[XY]/.test(anime.style.transform)) anime = anime.parentElement;
  if (!anime) throw new Error("élément animé introuvable");
  return { contenu, anime };
}

const variantes = [
  { nom: "drawer", etroit: false, translation: "translateX" },
  { nom: "bottom sheet", etroit: true, translation: "translateY" },
] as const;
const modes = ["light", "dark"] as const;

describe.each(variantes)("SidePanel $nom — ombre squircle", ({ etroit, translation }) => {
  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: matchMediaOriginal,
    });
  });

  describe.each(modes)("en thème %s", (mode) => {
    it("anime l'élément porteur selon l'axe attendu", () => {
      simulerViewport(etroit);
      const { anime } = ouvrirPanneau(mode);
      expect(anime.style.transform).toContain(translation);
    });

    it("porte le drop-shadow sur l'élément animé, sans le découper", () => {
      simulerViewport(etroit);
      const { anime } = ouvrirPanneau(mode);
      expect(porteUnDropShadow(anime)).toBe(true);
      expect(estDecoupeEnSquircle(anime)).toBe(false);
      expect(porteUnOverflowMasque(anime)).toBe(false);
    });

    it("confie découpe squircle, fond et overflow masqué à un enfant de l'élément animé", () => {
      simulerViewport(etroit);
      const { anime } = ouvrirPanneau(mode);
      const surface = Array.from(anime.children).find(estDecoupeEnSquircle);
      expect(surface).toBeDefined();
      expect(porteUnFond(surface as Element)).toBe(true);
      expect(porteUnOverflowMasque(surface as Element)).toBe(true);
      expect(porteUnDropShadow(surface as Element)).toBe(false);
    });

    it("rend le contenu à l'intérieur de la surface découpée", () => {
      simulerViewport(etroit);
      const { anime, contenu } = ouvrirPanneau(mode);
      const surface = Array.from(anime.children).find(estDecoupeEnSquircle);
      expect(contenu).toBeVisible();
      expect(surface?.contains(contenu)).toBe(true);
    });

    it("ne cumule jamais découpe squircle et drop-shadow sur un même élément", () => {
      simulerViewport(etroit);
      ouvrirPanneau(mode);
      expect(elementsDecoupesEtOmbres()).toEqual([]);
    });
  });
});
