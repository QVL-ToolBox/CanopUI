import { vi } from "vitest";
import { act, waitFor } from "@testing-library/react";
import { motionDurationSeconds } from "../../index";

export const BASE_DURATION_MS = motionDurationSeconds.base * 1000;

export function mockReducedMotion(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reduced && query.includes("prefers-reduced-motion"),
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

export async function elapse(milliseconds: number) {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  });
}

export async function millisecondsUntil(assertion: () => void): Promise<number> {
  const start = performance.now();
  await waitFor(assertion, { timeout: BASE_DURATION_MS * 4, interval: 5 });
  return performance.now() - start;
}

export interface ExitFrame {
  opacity: number;
  x: number;
  scale: number;
}

export function readExitFrame(element: HTMLElement): ExitFrame {
  const transform = element.style.transform;
  const x = /translateX\((-?[\d.]+)rem\)/.exec(transform);
  const scale = /scale\((-?[\d.]+)\)/.exec(transform);
  return {
    opacity: Number(element.style.opacity),
    x: x ? Number(x[1]) : 0,
    scale: scale ? Number(scale[1]) : 1,
  };
}

export function recordExitFrames(element: HTMLElement) {
  const frames: ExitFrame[] = [];
  const observer = new MutationObserver(() => frames.push(readExitFrame(element)));
  observer.observe(element, { attributes: true, attributeFilter: ["style"] });
  return {
    intermediate: () => frames.filter((frame) => frame.opacity > 0 && frame.opacity < 1),
    stop: () => observer.disconnect(),
  };
}
