import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { StatCard } from "../StatCard";

const preexistingPaletteColors = [
  "primary",
  "secondary",
  "accent",
  "success",
  "warning",
  "error",
  "info",
] as const;

function renderStatCard(iconColor?: React.ComponentProps<typeof StatCard>["iconColor"]) {
  const { container } = render(
    <CanopThemeProvider>
      <StatCard label="Fichiers" value="128" icon="star" iconColor={iconColor} />
    </CanopThemeProvider>,
  );
  const icon = container.querySelector("svg")!;
  return { icon, medallion: icon.parentElement! };
}

function tintOf(iconColor?: React.ComponentProps<typeof StatCard>["iconColor"]) {
  return getComputedStyle(renderStatCard(iconColor).medallion).backgroundColor;
}

describe("StatCard iconColor neutral", () => {
  it("teinte le médaillon avec la variable de palette text.disabled", () => {
    expect(tintOf("neutral")).toBe(
      "color-mix(in srgb, var(--canop-palette-text-disabled) 12%, transparent)",
    );
  });

  it("n'émet jamais la variable inexistante --canop-palette-neutral-main dans la teinte", () => {
    expect(tintOf("neutral")).not.toContain("--canop-palette-neutral-");
  });

  it("colore aussi le glyphe de l'icône avec la variable text.disabled", () => {
    expect(renderStatCard("neutral").icon).toHaveStyle({
      color: "var(--canop-palette-text-disabled)",
    });
  });
});

describe("StatCard non-régression des iconColor préexistantes", () => {
  it.each(preexistingPaletteColors)(
    "teinte le médaillon avec la variable main de %s",
    (iconColor) => {
      expect(tintOf(iconColor)).toBe(
        `color-mix(in srgb, var(--canop-palette-${iconColor}-main) 12%, transparent)`,
      );
    },
  );

  it("replie inherit sur la teinte primary", () => {
    expect(tintOf("inherit")).toBe(
      "color-mix(in srgb, var(--canop-palette-primary-main) 12%, transparent)",
    );
  });

  it("applique la teinte primary par défaut sans prop iconColor", () => {
    expect(tintOf()).toBe("color-mix(in srgb, var(--canop-palette-primary-main) 12%, transparent)");
  });
});
