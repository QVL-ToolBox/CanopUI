import { act, cleanup } from "@testing-library/react";
import { vi } from "vitest";

export const LARGEUR_SIMULEE = 320;
export const HAUTEUR_SIMULEE = 200;

export interface EspionResizeObserver {
  instances: number;
  deconnexions: number;
}

export interface HorlogeDeFrames {
  demandees: number;
  annulees: number;
  enAttente: () => number;
  avancer: () => void;
}

export interface EnvironnementChromium extends EspionResizeObserver {
  frames: HorlogeDeFrames;
}

let horlogeCourante: HorlogeDeFrames | null = null;
let rappelsEnAttente = new Map<number, FrameRequestCallback>();

function viderLesFrames() {
  const rappels = Array.from(rappelsEnAttente.values());
  rappelsEnAttente = new Map();
  rappels.forEach((rappel) => rappel(performance.now()));
}

export function installerFrames(): HorlogeDeFrames {
  let prochainId = 1;
  rappelsEnAttente = new Map();
  const horloge: HorlogeDeFrames = {
    demandees: 0,
    annulees: 0,
    enAttente: () => rappelsEnAttente.size,
    avancer: () => act(viderLesFrames),
  };
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((rappel: FrameRequestCallback) => {
      const id = prochainId++;
      horloge.demandees += 1;
      rappelsEnAttente.set(id, rappel);
      return id;
    }),
  );
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn((id: number) => {
      if (rappelsEnAttente.delete(id)) horloge.annulees += 1;
    }),
  );
  horlogeCourante = horloge;
  return horloge;
}

export function installerResizeObserver(): EspionResizeObserver {
  const espion = { instances: 0, deconnexions: 0 };
  class ResizeObserverSimule {
    private readonly rappel: ResizeObserverCallback;

    constructor(rappel: ResizeObserverCallback) {
      espion.instances += 1;
      this.rappel = rappel;
    }

    observe(cible: Element) {
      const entree = {
        target: cible,
        contentRect: { width: LARGEUR_SIMULEE, height: HAUTEUR_SIMULEE },
        borderBoxSize: [{ inlineSize: LARGEUR_SIMULEE, blockSize: HAUTEUR_SIMULEE }],
        contentBoxSize: [{ inlineSize: LARGEUR_SIMULEE, blockSize: HAUTEUR_SIMULEE }],
      } as unknown as ResizeObserverEntry;
      this.rappel([entree], this as unknown as ResizeObserver);
    }

    unobserve() {}

    disconnect() {
      espion.deconnexions += 1;
    }
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverSimule);
  return espion;
}

export function installerCanvas() {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation((() => ({
    createImageData: (largeur: number, hauteur: number) => ({
      data: new Uint8ClampedArray(largeur * hauteur * 4),
      width: largeur,
      height: hauteur,
    }),
    putImageData: () => undefined,
  })) as unknown as HTMLCanvasElement["getContext"]);
  return vi
    .spyOn(HTMLCanvasElement.prototype, "toDataURL")
    .mockReturnValue("data:image/png;base64,AAAA");
}

function installerMiseEnPage() {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: LARGEUR_SIMULEE,
    height: HAUTEUR_SIMULEE,
    top: 0,
    left: 0,
    right: LARGEUR_SIMULEE,
    bottom: HAUTEUR_SIMULEE,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(LARGEUR_SIMULEE);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(HAUTEUR_SIMULEE);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(LARGEUR_SIMULEE);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(HAUTEUR_SIMULEE);
}

export function declarerMarques(marques: string[]) {
  Object.defineProperty(navigator, "userAgentData", {
    configurable: true,
    value: { brands: marques.map((brand) => ({ brand, version: "130" })), mobile: false },
  });
}

export function declarerNavigateur(userAgent: string, vendor: string) {
  Object.defineProperty(navigator, "userAgent", { configurable: true, value: userAgent });
  Object.defineProperty(navigator, "vendor", { configurable: true, value: vendor });
}

export function simulerSupportCss() {
  vi.stubGlobal("CSS", { supports: () => true, escape: (valeur: string) => valeur });
}

export function declarerMachine(coeurs: number, memoireGo: number) {
  Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: coeurs });
  Object.defineProperty(navigator, "deviceMemory", { configurable: true, value: memoireGo });
}

export function rendreRepitSynchrone() {
  vi.stubGlobal(
    "requestIdleCallback",
    vi.fn((rappel: IdleRequestCallback) => {
      rappel({ didTimeout: false, timeRemaining: () => 50 });
      return 1;
    }),
  );
  vi.stubGlobal("cancelIdleCallback", vi.fn());
}

export function simulerChromium(): EnvironnementChromium {
  declarerMarques(["Chromium", "Google Chrome", "Not=A?Brand"]);
  declarerMachine(8, 8);
  rendreRepitSynchrone();
  simulerSupportCss();
  installerCanvas();
  installerMiseEnPage();
  const frames = installerFrames();
  return Object.assign(installerResizeObserver(), { frames });
}

export function revenirAJsdom() {
  cleanup();
  if (horlogeCourante) viderLesFrames();
  horlogeCourante = null;
  Reflect.deleteProperty(navigator, "userAgentData");
  Reflect.deleteProperty(navigator, "userAgent");
  Reflect.deleteProperty(navigator, "vendor");
  Reflect.deleteProperty(navigator, "hardwareConcurrency");
  Reflect.deleteProperty(navigator, "deviceMemory");
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
}
