import type { ReactNode } from "react";
import { vi } from "vitest";
import { render } from "@testing-library/react";
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
