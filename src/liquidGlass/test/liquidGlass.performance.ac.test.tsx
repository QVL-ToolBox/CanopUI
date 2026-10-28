import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { Card, CanopI18nProvider, CanopThemeProvider } from "../../index";
import { racineDeCarte } from "../../test/cardTestKit";
import { valeursEmises } from "../../test/cssRules";
import {
  declarerMachine,
  revenirAJsdom,
  simulerChromium,
  type HorlogeDeFrames,
} from "../../test/liquidGlassTestKit";

type StyleEnLigne = Record<"backdropFilter", string | undefined>;

const FLOU_LIQUIDE = "blur(0.25rem) saturate(1.8)";

interface RepitManuel {
  demandes: () => number;
  executer: () => void;
}

afterEach(revenirAJsdom);

function monter(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function poserCarte() {
  const vue = monter(
    <Card variant="frosted" title="Bonjour">
      Trois revues vous attendent.
    </Card>,
  );
  return { vue, racine: racineDeCarte(vue.container) };
}

function installerRepitManuel(): RepitManuel {
  let rappels: IdleRequestCallback[] = [];
  let demandes = 0;
  vi.stubGlobal(
    "requestIdleCallback",
    vi.fn((rappel: IdleRequestCallback) => {
      demandes += 1;
      rappels.push(rappel);
      return demandes;
    }),
  );
  vi.stubGlobal("cancelIdleCallback", vi.fn());
  return {
    demandes: () => demandes,
    executer: () =>
      act(() => {
        const enAttente = rappels;
        rappels = [];
        enAttente.forEach((rappel) => rappel({ didTimeout: false, timeRemaining: () => 50 }));
      }),
  };
}

function simulerTaille(largeur: number, hauteur: number) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: largeur,
    height: hauteur,
    top: 0,
    left: 0,
    right: largeur,
    bottom: hauteur,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(largeur);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(hauteur);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(largeur);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(hauteur);
  class ResizeObserverDimensionne {
    constructor(private readonly rappel: ResizeObserverCallback) {}

    observe(target: Element) {
      this.rappel(
        [
          {
            target,
            contentRect: { width: largeur, height: hauteur },
            borderBoxSize: [{ inlineSize: largeur, blockSize: hauteur }],
            contentBoxSize: [{ inlineSize: largeur, blockSize: hauteur }],
          } as unknown as ResizeObserverEntry,
        ],
        this as unknown as ResizeObserver,
      );
    }

    unobserve() {}

    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverDimensionne);
}

function refracte(racine: HTMLElement): boolean {
  const flou = (racine.style as unknown as StyleEnLigne).backdropFilter ?? "";
  return racine.querySelector("feDisplacementMap") !== null && flou.startsWith("url(#");
}

function flouDeLHote(racine: Element): string {
  return valeursEmises(racine, "backdrop-filter").at(-1) ?? "";
}

function avancer(frames: HorlogeDeFrames, nombre = 2) {
  for (let tour = 0; tour < nombre; tour += 1) frames.avancer();
}

describe("AC5 — carte de deplacement calculee en differe et mise en cache", () => {
  it("attend requestIdleCallback avant de poser la refraction d'une geometrie nouvelle", () => {
    const { frames } = simulerChromium();
    simulerTaille(411, 233);
    const repit = installerRepitManuel();

    const { racine } = poserCarte();
    avancer(frames);

    expect(refracte(racine)).toBe(false);
    expect(repit.demandes()).toBeGreaterThan(0);

    repit.executer();
    avancer(frames);

    expect(refracte(racine)).toBe(true);
  });

  it("sert tout de suite une geometrie deja en cache, sans attendre de repit", () => {
    const { frames } = simulerChromium();
    simulerTaille(377, 211);
    const premierRepit = installerRepitManuel();
    const premiere = poserCarte();
    avancer(frames);
    premierRepit.executer();
    avancer(frames);
    expect(refracte(premiere.racine)).toBe(true);
    premiere.vue.unmount();

    const secondRepit = installerRepitManuel();
    const { racine } = poserCarte();
    avancer(frames);

    expect(refracte(racine)).toBe(true);
    expect(secondRepit.demandes()).toBe(0);
  });

  it("recalcule en differe une geometrie differente de celle en cache", () => {
    const { frames } = simulerChromium();
    simulerTaille(353, 199);
    const premierRepit = installerRepitManuel();
    const premiere = poserCarte();
    avancer(frames);
    premierRepit.executer();
    avancer(frames);
    premiere.vue.unmount();

    simulerTaille(509, 287);
    const secondRepit = installerRepitManuel();
    const { racine } = poserCarte();
    avancer(frames);

    expect(refracte(racine)).toBe(false);
    expect(secondRepit.demandes()).toBeGreaterThan(0);
    secondRepit.executer();
    avancer(frames);
    expect(refracte(racine)).toBe(true);
  });

  it("garde le flou pendant le calcul differe", () => {
    const { frames } = simulerChromium();
    simulerTaille(431, 241);
    installerRepitManuel();

    const { racine } = poserCarte();
    avancer(frames);

    expect(flouDeLHote(racine)).toBe(FLOU_LIQUIDE);
  });
});

describe("AC5 — pas de refraction sur machine modeste", () => {
  it.each([
    ["2 coeurs", 2, 8],
    ["1 coeur", 1, 8],
    ["2 Go", 8, 2],
    ["1 Go", 8, 1],
  ])("ne refracte pas et garde le flou sur une machine a %s", (_label, coeurs, memoireGo) => {
    const { frames } = simulerChromium();
    declarerMachine(coeurs, memoireGo);

    const { racine } = poserCarte();
    avancer(frames, 3);

    expect(refracte(racine)).toBe(false);
    expect(racine.querySelector("feDisplacementMap")).toBeNull();
    expect((racine.style as unknown as StyleEnLigne).backdropFilter ?? "").not.toContain("url(");
    expect(flouDeLHote(racine)).toBe(FLOU_LIQUIDE);
  });

  it.each([
    ["3 coeurs et 3 Go", 3, 3],
    ["4 coeurs et 4 Go", 4, 4],
  ])("refracte sur une machine a %s", (_label, coeurs, memoireGo) => {
    const { frames } = simulerChromium();
    declarerMachine(coeurs, memoireGo);

    const { racine } = poserCarte();
    avancer(frames, 3);

    expect(refracte(racine)).toBe(true);
  });

  it("refracte quand deviceMemory n'est pas expose sur une machine a 8 coeurs", () => {
    const { frames } = simulerChromium();
    Reflect.deleteProperty(navigator, "deviceMemory");

    const { racine } = poserCarte();
    avancer(frames, 3);

    expect(refracte(racine)).toBe(true);
  });
});
