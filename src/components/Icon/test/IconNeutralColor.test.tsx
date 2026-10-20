import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Icon } from "../Icon";

const preexistingPaletteColors = [
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "error",
  "info",
] as const;

const iconSizes = ["xs", "sm", "md", "lg", "xl"] as const;

const iconVariants = ["outline", "solid"] as const;

function renderIcon(props: Partial<React.ComponentProps<typeof Icon>> = {}) {
  const { container } = render(<Icon name="star" {...props} />);
  return container.querySelector("svg")!;
}

describe("Icon couleur neutral", () => {
  it("résout neutral vers la variable de palette text.disabled du thème", () => {
    expect(renderIcon({ color: "neutral" })).toHaveStyle({
      color: "var(--canop-palette-text-disabled)",
    });
  });

  it("n'émet jamais la variable inexistante --canop-palette-neutral-main pour neutral", () => {
    expect(renderIcon({ color: "neutral" }).getAttribute("style")).not.toContain(
      "--canop-palette-neutral-",
    );
  });
});

describe("Icon non-régression des couleurs préexistantes", () => {
  it.each(preexistingPaletteColors)(
    "résout %s vers sa variable de palette main inchangée",
    (color) => {
      expect(renderIcon({ color })).toHaveStyle({ color: `var(--canop-palette-${color}-main)` });
    },
  );

  it("résout inherit vers currentColor", () => {
    expect(renderIcon({ color: "inherit" }).style.color).toBe("currentcolor");
  });

  it("conserve currentColor comme couleur par défaut sans prop color", () => {
    expect(renderIcon().style.color).toBe("currentcolor");
  });
});

describe("Icon trio de médailles du podium", () => {
  function resolvedColor(color: React.ComponentProps<typeof Icon>["color"]) {
    return renderIcon({ color }).style.color;
  }

  it("mappe l'or sur la variable accent main", () => {
    expect(resolvedColor("accent")).toBe("var(--canop-palette-accent-main)");
  });

  it("mappe l'argent sur la variable text.disabled", () => {
    expect(resolvedColor("neutral")).toBe("var(--canop-palette-text-disabled)");
  });

  it("mappe le bronze sur la variable warning main", () => {
    expect(resolvedColor("warning")).toBe("var(--canop-palette-warning-main)");
  });

  it("attribue trois variables distinctes aux trois médailles", () => {
    const medals = [resolvedColor("accent"), resolvedColor("neutral"), resolvedColor("warning")];
    expect(new Set(medals).size).toBe(3);
  });
});

describe("Icon orthogonalité de neutral", () => {
  it.each(iconVariants)("conserve la couleur neutral avec le variant %s", (variant) => {
    expect(renderIcon({ color: "neutral", variant })).toHaveStyle({
      color: "var(--canop-palette-text-disabled)",
    });
  });

  it.each(iconSizes)("conserve la couleur neutral à la taille %s", (size) => {
    expect(renderIcon({ color: "neutral", size })).toHaveStyle({
      color: "var(--canop-palette-text-disabled)",
    });
  });

  it("applique toujours une dimension propre à chaque taille en neutral", () => {
    const widths = iconSizes.map((size) =>
      renderIcon({ color: "neutral", size }).getAttribute("width")!,
    );
    expect(widths.every((width) => width.length > 0)).toBe(true);
    expect(new Set(widths).size).toBe(iconSizes.length);
  });

  it("expose un rôle img et un libellé accessible en neutral avec title", () => {
    renderIcon({ color: "neutral", title: "Médaille d'argent" });
    expect(screen.getByRole("img", { name: "Médaille d'argent" })).toBeInTheDocument();
  });

  it("reste masqué de l'arbre d'accessibilité en neutral sans title", () => {
    expect(renderIcon({ color: "neutral" })).toHaveAttribute("aria-hidden", "true");
  });
});
