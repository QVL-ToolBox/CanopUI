import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { declarationsEmotionDe } from "../../../test/cssRules";
import { Spinner } from "../Spinner";

function renderSpinner(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const strokesApplyingTo = (circle: Element) =>
  declarationsEmotionDe(circle, "stroke", [
    circle,
    circle.closest('[role="progressbar"]') as Element,
  ]).map((entree) => entree.valeur.replaceAll('"', ""));

const stopColors = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("defs stop")).map((stop) => stop.getAttribute("style"));

describe("Spinner — couleur par défaut", () => {
  it("given no color, when rendered, then an accent gradient is referenced by the stroke", () => {
    const { container } = renderSpinner(<Spinner />);
    const gradient = container.querySelector("linearGradient");
    const circle = container.querySelector("circle") as Element;

    expect(gradient).not.toBeNull();
    expect(stopColors(container)).toEqual([
      "stop-color: var(--canop-palette-accent-light);",
      "stop-color: var(--canop-palette-accent-main);",
      "stop-color: var(--canop-palette-accent-dark);",
    ]);
    expect(
      strokesApplyingTo(circle).some((valeur) => valeur.includes(`url(#${gradient?.id})`)),
    ).toBe(true);
  });

  it("given color primary, when rendered, then the gradient uses the primary shades", () => {
    const { container } = renderSpinner(<Spinner color="primary" />);

    expect(stopColors(container)).toEqual([
      "stop-color: var(--canop-palette-primary-light);",
      "stop-color: var(--canop-palette-primary-main);",
      "stop-color: var(--canop-palette-primary-dark);",
    ]);
  });
});

describe("Spinner — couleur héritée", () => {
  it("given color inherit, when rendered, then no gradient and no zero-size svg exist", () => {
    const { container } = renderSpinner(<Spinner color="inherit" />);

    expect(container.querySelector("linearGradient")).toBeNull();
    expect(container.querySelector('svg[width="0"]')).toBeNull();
    expect(container.querySelector('svg[height="0"]')).toBeNull();
  });

  it("given color inherit, when rendered, then the stroke is currentColor with the colorInherit class", () => {
    const { container } = renderSpinner(<Spinner color="inherit" />);
    const circle = container.querySelector("circle") as Element;

    expect(screen.getByRole("progressbar").className).toContain("MuiCircularProgress-colorInherit");
    const strokes = strokesApplyingTo(circle).map((valeur) => valeur.toLowerCase());

    expect(strokes).toContain("currentcolor");
    expect(strokes.some((valeur) => valeur.includes("url("))).toBe(false);
  });

  it("given color inherit inside a coloured parent, when rendered, then the spinner takes the parent colour", () => {
    renderSpinner(
      <div style={{ color: "rgb(12, 34, 56)" }}>
        <Spinner color="inherit" />
      </div>,
    );

    expect(getComputedStyle(screen.getByRole("progressbar")).color).toBe("rgb(12, 34, 56)");
  });

  it("given color inherit, when rendered without label, then the default label is kept", () => {
    renderSpinner(<Spinner color="inherit" />);

    expect(screen.getByRole("progressbar", { name: "Chargement" })).toBeInTheDocument();
  });

  it("given color inherit and a label, when rendered, then the label is used", () => {
    renderSpinner(<Spinner color="inherit" ariaLabel="Envoi en cours" />);

    expect(screen.getByRole("progressbar", { name: "Envoi en cours" })).toBeInTheDocument();
  });

  it("given color inherit and fullPage, when rendered, then the full page container wraps the spinner", () => {
    const { container } = renderSpinner(<Spinner color="inherit" fullPage />);

    expect(container.querySelector(".MuiBox-root")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
