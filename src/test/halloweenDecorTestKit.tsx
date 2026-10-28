import type { ReactNode } from "react";
import { vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { CanopThemeProvider } from "../index";
import { reglesEmises } from "./cssRules";

export function mockMatchMedia(reducedMotion: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: reducedMotion && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

export interface MachineSimulee {
  coeurs: number;
  memoireGo: number;
}

export const MACHINE_PUISSANTE: MachineSimulee = { coeurs: 8, memoireGo: 8 };

export function simulerMachine({ coeurs, memoireGo }: MachineSimulee) {
  Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: coeurs });
  Object.defineProperty(navigator, "deviceMemory", { configurable: true, value: memoireGo });
}

export function oublierMachine() {
  Reflect.deleteProperty(navigator, "hardwareConcurrency");
  Reflect.deleteProperty(navigator, "deviceMemory");
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

export function preparerDecorDeterministe(machine: MachineSimulee = MACHINE_PUISSANTE) {
  simulerMachine(machine);
  rendreRepitSynchrone();
}

export function quitterDecor() {
  cleanup();
  vi.unstubAllGlobals();
  oublierMachine();
}

export function renderDecor(decor: ReactNode) {
  return render(
    <CanopThemeProvider season="halloween" seasonalDecor={false}>
      {decor}
    </CanopThemeProvider>,
  );
}

export function runningAnimations(layer: HTMLElement): string[] {
  const elements = [layer, ...Array.from(layer.querySelectorAll("*"))];
  return elements
    .flatMap((element) => reglesEmises(element))
    .filter((rule) => rule.conditions.length === 0)
    .map(
      (rule) =>
        rule.style.getPropertyValue("animation-name") ||
        rule.style.getPropertyValue("animation").split(" ")[0] ||
        "",
    )
    .filter((name) => name !== "" && name !== "none");
}
