import { afterEach, beforeEach, describe, expect, expectTypeOf, it } from "vitest";
import { render } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Skeleton, type CanopSkeletonProps } from "../Skeleton";

const originalMatchMedia = window.matchMedia;

function simulateReducedMotion(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: reduced && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

function renderSkeleton(ui: React.ReactElement) {
  const { container } = render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
  const root = container.querySelector("[data-variant]") as HTMLElement;
  return { root, bars: Array.from(root.querySelectorAll("[data-pulse]")) };
}

describe("Skeleton", () => {
  beforeEach(() => {
    simulateReducedMotion(false);
  });

  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    });
  });

  it("given un squelette en bloc, when on le rend, then il est masque aux technologies d'assistance", () => {
    const { root } = renderSkeleton(<Skeleton />);

    expect(root).toHaveAttribute("aria-hidden", "true");
  });

  it("given un squelette en lignes, when on le rend, then il est masque aux technologies d'assistance", () => {
    const { root } = renderSkeleton(<Skeleton variant="lines" lines={3} />);

    expect(root).toHaveAttribute("aria-hidden", "true");
  });

  it("given un squelette, when on le rend, then il ne porte pas aria-busy, reserve au conteneur", () => {
    const { root } = renderSkeleton(<Skeleton variant="lines" lines={2} />);

    expect(root).not.toHaveAttribute("aria-busy");
  });

  it("given un conteneur aria-busy, when il contient un squelette, then le squelette n'est pas expose", () => {
    const { container } = render(
      <CanopThemeProvider>
        <section aria-busy="true" aria-label="Chargement des membres">
          <Skeleton variant="lines" lines={2} />
        </section>
      </CanopThemeProvider>,
    );

    expect(container.querySelector("section")).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector("[data-variant]")).toHaveAttribute("aria-hidden", "true");
  });

  it("given la variante bloc, when on la rend, then une seule barre est affichee", () => {
    const { root, bars } = renderSkeleton(<Skeleton variant="block" />);

    expect(root).toHaveAttribute("data-variant", "block");
    expect(bars).toHaveLength(1);
  });

  it.each([1, 3, 5])(
    "given la variante lignes avec %i lignes, when on la rend, then autant de barres sont affichees",
    (lines) => {
      const { root, bars } = renderSkeleton(<Skeleton variant="lines" lines={lines} />);

      expect(root).toHaveAttribute("data-variant", "lines");
      expect(bars).toHaveLength(lines);
    },
  );

  it.each([0, -2, 2.7, Number.NaN])(
    "given la variante lignes avec la valeur %s, when on la rend, then au moins une barre est affichee",
    (lines) => {
      const { bars } = renderSkeleton(<Skeleton variant="lines" lines={lines} />);

      expect(bars.length).toBeGreaterThanOrEqual(1);
      expect(Number.isInteger(bars.length)).toBe(true);
    },
  );

  it("given un mouvement autorise, when on rend le squelette, then la pulsation est active", () => {
    const { bars } = renderSkeleton(<Skeleton variant="lines" lines={3} />);

    expect(bars.map((bar) => bar.getAttribute("data-pulse"))).toEqual(["on", "on", "on"]);
  });

  it("given animated a false, when on rend le squelette, then la pulsation est desactivee", () => {
    const { bars } = renderSkeleton(<Skeleton variant="lines" lines={3} animated={false} />);

    expect(bars.map((bar) => bar.getAttribute("data-pulse"))).toEqual(["off", "off", "off"]);
  });

  it("given une preference de mouvement reduit, when on rend le squelette, then la pulsation est desactivee", () => {
    simulateReducedMotion(true);

    const { bars } = renderSkeleton(<Skeleton variant="lines" lines={3} />);

    expect(bars.map((bar) => bar.getAttribute("data-pulse"))).toEqual(["off", "off", "off"]);
  });

  it("given une preference de mouvement reduit, when on rend un bloc, then la pulsation est desactivee", () => {
    simulateReducedMotion(true);

    const { bars } = renderSkeleton(<Skeleton />);

    expect(bars.map((bar) => bar.getAttribute("data-pulse"))).toEqual(["off"]);
  });

  it("given aucune prop, when on rend le squelette, then c'est un bloc de 4rem de haut", () => {
    const { root, bars } = renderSkeleton(<Skeleton />);

    expect(root).toHaveAttribute("data-variant", "block");
    expect(bars).toHaveLength(1);
    expect(bars[0]).toHaveStyle({ height: "4rem" });
  });

  it("given la variante lignes, when on la rend, then les lignes sont empilees en colonne avec un ecart", () => {
    const { root } = renderSkeleton(<Skeleton variant="lines" lines={3} />);

    const style = getComputedStyle(root);
    expect(style.display).toBe("flex");
    expect(style.flexDirection).toBe("column");
    expect(parseFloat(style.rowGap) || parseFloat(style.gap)).toBeGreaterThan(0);
  });

  it("given des combinaisons de props incoherentes, when on type le composant, then elles sont refusees", () => {
    expectTypeOf<{ variant: "lines"; height: string }>().not.toExtend<CanopSkeletonProps>();
    expectTypeOf<{ lines: number }>().not.toExtend<CanopSkeletonProps>();
  });

  it("given des combinaisons de props coherentes, when on type le composant, then elles sont acceptees", () => {
    expectTypeOf<{ variant: "lines"; lines: number }>().toExtend<CanopSkeletonProps>();
    expectTypeOf<{ variant: "block"; height: string }>().toExtend<CanopSkeletonProps>();
  });
});
