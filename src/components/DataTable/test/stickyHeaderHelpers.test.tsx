import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useState } from "react";
import { stickyHeaderClipPath } from "../stickyHeaderClipPath";
import { useScrollbarWidth } from "../useScrollbarWidth";
import { useStickyHeaderHeight } from "../useStickyHeaderHeight";

const resizeCallbacks: ResizeObserverCallback[] = [];

class RecordingResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeCallbacks.push(callback);
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

const metrics = new Map<string, number>();
const originals = new Map<string, PropertyDescriptor | undefined>();

function stubElementMetric(name: string, value: number) {
  metrics.set(name, value);
  if (originals.has(name)) return;
  originals.set(name, Object.getOwnPropertyDescriptor(HTMLElement.prototype, name));
  Object.defineProperty(HTMLElement.prototype, name, {
    configurable: true,
    get: () => metrics.get(name),
  });
}

function restoreElementMetrics() {
  originals.forEach((original, name) => {
    if (original) Object.defineProperty(HTMLElement.prototype, name, original);
    else delete (HTMLElement.prototype as unknown as Record<string, unknown>)[name];
  });
  originals.clear();
  metrics.clear();
}

function notifyResize(entries: ResizeObserverEntry[] = []) {
  act(() => {
    resizeCallbacks.forEach((callback) => callback(entries, {} as ResizeObserver));
  });
}

function HeaderHeightProbe({ enabled }: { enabled: boolean }) {
  const { headerRef, headerHeight } = useStickyHeaderHeight(enabled);
  return (
    <table>
      <thead ref={headerRef}>
        <tr>
          <th>{`hauteur:${headerHeight}`}</th>
        </tr>
      </thead>
    </table>
  );
}

function ScrollbarWidthProbe({ enabled }: { enabled: boolean }) {
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const width = useScrollbarWidth(scrollEl, enabled);
  return <div ref={setScrollEl}>{`scrollbar:${width}`}</div>;
}

afterEach(() => {
  vi.unstubAllGlobals();
  restoreElementMetrics();
  resizeCallbacks.splice(0);
});

describe("stickyHeaderClipPath", () => {
  it("given une en-tête de 40px, when on calcule la découpe, then c'est un polygon sans boîte de référence", () => {
    const clip = stickyHeaderClipPath({ headerHeight: 40, scrollbarWidth: 0 });

    expect(clip).toMatch(/^polygon\(.*\)$/);
    expect(clip).not.toContain("content-box");
    expect(clip).toContain("40px");
  });

  it("given deux hauteurs d'en-tête, when on calcule la découpe, then elle suit la hauteur", () => {
    const basse = stickyHeaderClipPath({ headerHeight: 40, scrollbarWidth: 0 });
    const haute = stickyHeaderClipPath({ headerHeight: 72, scrollbarWidth: 0 });

    expect(haute).not.toBe(basse);
    expect(haute).toContain("72px");
    expect(haute).not.toContain("40px");
  });

  it("given une scrollbar de 15px, when on calcule la découpe, then elle tient compte de sa largeur", () => {
    const sans = stickyHeaderClipPath({ headerHeight: 40, scrollbarWidth: 0 });
    const avec = stickyHeaderClipPath({ headerHeight: 40, scrollbarWidth: 15 });

    expect(avec).not.toBe(sans);
    expect(avec).toContain("15px");
  });

  it("given une en-tête de 40px, when on calcule la découpe, then les coins suivent le rayon de 1,5rem des lignes", () => {
    expect(stickyHeaderClipPath({ headerHeight: 40, scrollbarWidth: 0 })).toContain("1.5rem");
  });
});

describe("useStickyHeaderHeight", () => {
  it("given le mode figé, when l'en-tête est montée, then sa hauteur est mesurée", () => {
    vi.stubGlobal("ResizeObserver", RecordingResizeObserver);
    stubElementMetric("offsetHeight", 48);
    render(<HeaderHeightProbe enabled />);

    expect(screen.getByText("hauteur:48")).toBeInTheDocument();
  });

  it("given le mode figé, when le ResizeObserver signale une nouvelle hauteur, then la hauteur est recalculée", () => {
    vi.stubGlobal("ResizeObserver", RecordingResizeObserver);
    stubElementMetric("offsetHeight", 48);
    render(<HeaderHeightProbe enabled />);

    stubElementMetric("offsetHeight", 64);
    notifyResize([
      { borderBoxSize: [{ blockSize: 64, inlineSize: 300 }] } as unknown as ResizeObserverEntry,
    ]);

    expect(screen.getByText("hauteur:64")).toBeInTheDocument();
  });

  it("given le mode non figé, when l'en-tête est montée, then aucune mesure n'est faite", () => {
    vi.stubGlobal("ResizeObserver", RecordingResizeObserver);
    stubElementMetric("offsetHeight", 48);
    render(<HeaderHeightProbe enabled={false} />);

    expect(screen.getByText("hauteur:0")).toBeInTheDocument();
    expect(resizeCallbacks).toHaveLength(0);
  });

  it("given un environnement sans ResizeObserver, when l'en-tête est montée, then la hauteur est mesurée sans erreur", () => {
    vi.stubGlobal("ResizeObserver", undefined);
    stubElementMetric("offsetHeight", 48);

    expect(() => render(<HeaderHeightProbe enabled />)).not.toThrow();
    expect(screen.getByText("hauteur:48")).toBeInTheDocument();
  });
});

describe("useScrollbarWidth", () => {
  it("given une scrollbar classique, when le conteneur est monté, then sa largeur est mesurée", () => {
    vi.stubGlobal("ResizeObserver", RecordingResizeObserver);
    stubElementMetric("offsetWidth", 600);
    stubElementMetric("clientWidth", 585);
    render(<ScrollbarWidthProbe enabled />);

    expect(screen.getByText("scrollbar:15")).toBeInTheDocument();
  });

  it("given une scrollbar qui apparaît, when le ResizeObserver le signale, then la largeur est recalculée", () => {
    vi.stubGlobal("ResizeObserver", RecordingResizeObserver);
    stubElementMetric("offsetWidth", 600);
    stubElementMetric("clientWidth", 600);
    render(<ScrollbarWidthProbe enabled />);
    expect(screen.getByText("scrollbar:0")).toBeInTheDocument();

    stubElementMetric("clientWidth", 588);
    notifyResize();

    expect(screen.getByText("scrollbar:12")).toBeInTheDocument();
  });

  it("given le mode non figé, when le conteneur est monté, then aucune mesure n'est faite", () => {
    vi.stubGlobal("ResizeObserver", RecordingResizeObserver);
    stubElementMetric("offsetWidth", 600);
    stubElementMetric("clientWidth", 585);
    render(<ScrollbarWidthProbe enabled={false} />);

    expect(screen.getByText("scrollbar:0")).toBeInTheDocument();
  });

  it("given un environnement sans ResizeObserver, when le conteneur est monté, then la largeur est mesurée sans erreur", () => {
    vi.stubGlobal("ResizeObserver", undefined);
    stubElementMetric("offsetWidth", 600);
    stubElementMetric("clientWidth", 585);

    expect(() => render(<ScrollbarWidthProbe enabled />)).not.toThrow();
    expect(screen.getByText("scrollbar:15")).toBeInTheDocument();
  });
});
