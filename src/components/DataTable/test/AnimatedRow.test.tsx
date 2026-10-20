import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { AnimatedRow, type AnimatedRowProps } from "../AnimatedRow";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function stubMatchMedia(matchedQueries: string[] = []) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: matchedQueries.includes(query),
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

const observers: { callback: IntersectionObserverCallback }[] = [];

class PendingIntersectionObserver {
  callback: IntersectionObserverCallback;
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    observers.push(this);
  }
}

function enterViewport() {
  act(() => {
    observers.forEach((observer) =>
      observer.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        undefined as unknown as IntersectionObserver,
      ),
    );
  });
}

function buildProps(overrides: Partial<AnimatedRowProps> = {}): AnimatedRowProps {
  return {
    animate: true,
    scrollRoot: null,
    index: 0,
    alreadyAnimated: false,
    onAnimated: () => {},
    children: <td>Cellule</td>,
    ...overrides,
  };
}

function renderRow(overrides: Partial<AnimatedRowProps> = {}) {
  render(
    <CanopThemeProvider>
      <table>
        <tbody>
          <AnimatedRow {...buildProps(overrides)} />
        </tbody>
      </table>
    </CanopThemeProvider>,
  );
  return screen.getByRole("row");
}

function renderRowsAtIndexes(indexes: number[]) {
  render(
    <CanopThemeProvider>
      <table>
        <tbody>
          {indexes.map((index) => (
            <AnimatedRow key={index} {...buildProps({ index, children: <td>L{index}</td> })} />
          ))}
        </tbody>
      </table>
    </CanopThemeProvider>,
  );
  return (index: number) => screen.getByText(`L${index}`).closest("tr") as HTMLElement;
}

const delayOf = (row: HTMLElement) => getComputedStyle(row).transitionDelay;

describe("AnimatedRow — lignes déjà visibles", () => {
  beforeEach(() => {
    stubMatchMedia();
    observers.length = 0;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("n'applique aucune animation quand animate est faux", () => {
    const row = renderRow({ animate: false, index: 1 });

    expect(row).not.toHaveStyle({ opacity: "0" });
    expect(row).not.toHaveStyle({ transitionDelay: "0.04s" });
  });

  it("affiche la ligne sans délai à la première position", () => {
    const row = renderRow({ index: 0 });

    expect(row).toHaveStyle({ opacity: "1", transitionDelay: "0s" });
  });

  it("décale l'apparition des lignes suivantes", () => {
    const row = renderRow({ index: 1 });

    expect(row).toHaveStyle({ transitionDelay: "0.04s" });
  });

  it("plafonne le décalage au-delà de la douzième ligne", () => {
    const rowAt = renderRowsAtIndexes([11, 12, 30]);

    expect(delayOf(rowAt(12))).toBe(delayOf(rowAt(30)));
    expect(delayOf(rowAt(11))).not.toBe(delayOf(rowAt(12)));
  });

  it("supprime le délai et la durée pour une ligne déjà animée", () => {
    const row = renderRow({ index: 5, alreadyAnimated: true });

    expect(row).toHaveStyle({ transitionDelay: "0s", transitionDuration: "0s" });
  });

  it("transmet les propriétés de ligne au rendu animé", () => {
    const row = renderRow({ index: 0, id: "k1", "aria-selected": true });

    expect(row).toHaveAttribute("id", "k1");
    expect(row).toHaveAttribute("aria-selected", "true");
  });

  it("transmet les propriétés de ligne au rendu non animé", () => {
    const row = renderRow({ animate: false, id: "k2", "aria-selected": false });

    expect(row).toHaveAttribute("id", "k2");
    expect(row).toHaveAttribute("aria-selected", "false");
  });

  it("fusionne un style personnalisé fourni sous forme d'objet", () => {
    const row = renderRow({ index: 0, sx: { fontStyle: "italic" } });

    expect(row).toHaveStyle({ fontStyle: "italic" });
  });

  it("fusionne un style personnalisé fourni sous forme de tableau", () => {
    const row = renderRow({
      index: 0,
      sx: [{ fontStyle: "italic" }, { textTransform: "uppercase" }],
    });

    expect(row).toHaveStyle({ fontStyle: "italic", textTransform: "uppercase" });
  });

  it("applique le style personnalisé même sans animation", () => {
    const row = renderRow({ animate: false, sx: { fontStyle: "italic" } });

    expect(row).toHaveStyle({ fontStyle: "italic" });
  });
});

describe("AnimatedRow — entrée dans le viewport", () => {
  beforeEach(() => {
    stubMatchMedia();
    observers.length = 0;
    vi.stubGlobal("IntersectionObserver", PendingIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("masque la ligne tant qu'elle n'est pas entrée dans le viewport", () => {
    const row = renderRow({ index: 2 });

    expect(row).toHaveStyle({ opacity: "0" });
  });

  it("révèle la ligne quand elle entre dans le viewport", () => {
    const row = renderRow({ index: 2 });

    enterViewport();

    expect(row).toHaveStyle({ opacity: "1" });
  });

  it("signale l'animation une seule fois à l'entrée", () => {
    const onAnimated = vi.fn();
    renderRow({ index: 2, onAnimated });

    expect(onAnimated).not.toHaveBeenCalled();

    enterViewport();

    expect(onAnimated).toHaveBeenCalledTimes(1);
  });

  it("ne signale rien pour une ligne déjà animée", () => {
    const onAnimated = vi.fn();
    renderRow({ index: 2, alreadyAnimated: true, onAnimated });

    enterViewport();

    expect(onAnimated).not.toHaveBeenCalled();
  });

  it("affiche immédiatement une ligne déjà animée hors du viewport", () => {
    const row = renderRow({ index: 2, alreadyAnimated: true });

    expect(row).toHaveStyle({ opacity: "1" });
  });

  it("n'observe rien quand animate est faux", () => {
    renderRow({ animate: false, index: 2 });

    expect(observers).toHaveLength(0);
  });
});

describe("AnimatedRow — mouvement réduit", () => {
  beforeEach(() => {
    observers.length = 0;
    stubMatchMedia([reducedMotionQuery]);
    vi.stubGlobal("IntersectionObserver", PendingIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("n'applique ni opacité nulle ni décalage", () => {
    const row = renderRow({ index: 5 });

    expect(row).not.toHaveStyle({ opacity: "0" });
    expect(row).not.toHaveStyle({ transitionDelay: "0.2s" });
  });

  it("n'observe pas l'entrée dans le viewport", () => {
    renderRow({ index: 5 });

    expect(observers).toHaveLength(0);
  });

  it("conserve le style personnalisé", () => {
    const row = renderRow({ index: 5, sx: { fontStyle: "italic" } });

    expect(row).toHaveStyle({ fontStyle: "italic" });
  });
});
