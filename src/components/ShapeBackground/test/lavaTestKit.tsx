import type { ReactElement } from "react";
import { act, render } from "@testing-library/react";
import { vi } from "vitest";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import {
  installerFrames,
  installerResizeObserver,
  revenirAJsdom,
  type EspionResizeObserver,
  type HorlogeDeFrames,
} from "../../../test/liquidGlassTestKit";

export interface EnvironnementLave {
  frames: HorlogeDeFrames;
  redimensionnement: EspionResizeObserver;
  appelsCanvas: string[];
  visibilite: VisibiliteSimulee;
}

export interface VisibiliteSimulee {
  observateurs: number;
  deconnexions: number;
  afficher: () => void;
  masquer: () => void;
}

const REQUETE_MOUVEMENT_REDUIT = "(prefers-reduced-motion: reduce)";

function contexteEspion(appels: string[]) {
  const pinceau = { addColorStop: () => undefined };
  return new Proxy(
    {},
    {
      get: (_cible, nom) => {
        const methode = String(nom);
        appels.push(methode);
        if (methode.startsWith("create") || methode.startsWith("get")) {
          return (largeur = 1, hauteur = 1) => ({
            ...pinceau,
            data: new Uint8ClampedArray(Math.max(1, largeur * hauteur * 4)),
            width: largeur,
            height: hauteur,
          });
        }
        if (methode === "measureText") return () => ({ width: 0 });
        return () => undefined;
      },
      set: () => true,
    },
  );
}

export function installerCanvasEspion(): string[] {
  const appels: string[] = [];
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation((() =>
    contexteEspion(appels)) as unknown as HTMLCanvasElement["getContext"]);
  return appels;
}

export function simulerMouvementReduit(actif: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((requete: string) => ({
      matches: actif && requete === REQUETE_MOUVEMENT_REDUIT,
      media: requete,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function definirEtatOnglet(etat: DocumentVisibilityState) {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => etat });
  Object.defineProperty(document, "hidden", { configurable: true, get: () => etat === "hidden" });
}

export function changerOnglet(etat: DocumentVisibilityState) {
  act(() => {
    definirEtatOnglet(etat);
    document.dispatchEvent(new Event("visibilitychange"));
  });
}

export function installerIntersectionObserver(): VisibiliteSimulee {
  const rappels = new Map<
    IntersectionObserver,
    { rappel: IntersectionObserverCallback; cibles: Element[] }
  >();
  const notifier = (visible: boolean) =>
    act(() => {
      rappels.forEach(({ rappel, cibles }, observateur) => {
        const entrees = cibles.map(
          (target) =>
            ({
              target,
              isIntersecting: visible,
              intersectionRatio: visible ? 1 : 0,
            }) as unknown as IntersectionObserverEntry,
        );
        rappel(entrees, observateur);
      });
    });
  const visibilite: VisibiliteSimulee = {
    observateurs: 0,
    deconnexions: 0,
    afficher: () => notifier(true),
    masquer: () => notifier(false),
  };
  class IntersectionObserverSimule {
    constructor(rappel: IntersectionObserverCallback) {
      visibilite.observateurs += 1;
      rappels.set(this as unknown as IntersectionObserver, { rappel, cibles: [] });
    }

    observe(cible: Element) {
      rappels.get(this as unknown as IntersectionObserver)?.cibles.push(cible);
    }

    unobserve() {}

    takeRecords() {
      return [];
    }

    disconnect() {
      visibilite.deconnexions += 1;
      rappels.delete(this as unknown as IntersectionObserver);
    }
  }
  vi.stubGlobal("IntersectionObserver", IntersectionObserverSimule);
  return visibilite;
}

export function installerEnvironnementLave(): EnvironnementLave {
  definirEtatOnglet("visible");
  simulerMouvementReduit(false);
  return {
    frames: installerFrames(),
    redimensionnement: installerResizeObserver(),
    appelsCanvas: installerCanvasEspion(),
    visibilite: installerIntersectionObserver(),
  };
}

export function quitterEnvironnementLave() {
  revenirAJsdom();
  Reflect.deleteProperty(document, "visibilityState");
  Reflect.deleteProperty(document, "hidden");
}

export function avancerFrames(frames: HorlogeDeFrames, nombre: number) {
  for (let tour = 0; tour < nombre; tour += 1) frames.avancer();
}

export function rendreAvecTheme(ui: ReactElement, mode: "light" | "dark" = "light") {
  return render(ui, {
    wrapper: ({ children }) => (
      <CanopI18nProvider locale="fr">
        <CanopThemeProvider defaultMode={mode}>{children}</CanopThemeProvider>
      </CanopI18nProvider>
    ),
  });
}

export function coucheDecorative(racine: ParentNode = document): HTMLElement {
  const couche = racine.querySelector("canvas")?.closest<HTMLElement>("[aria-hidden='true']");
  if (!couche) throw new Error("couche décorative introuvable");
  return couche;
}

export function lueurs(racine: ParentNode = document): HTMLElement[] {
  return Array.from(
    coucheDecorative(racine).querySelectorAll<HTMLElement>("div[style*='opacity']"),
  );
}
