import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Card,
  StatCard,
  palette,
  paletteDark,
  type CanopCardProps,
  type CanopCardTone,
  type CanopLegendTone,
} from "../../../index";
import { contrastRatio, mixSrgb } from "../../../test/contrastRatio";
import { fondsDe, poser, racineDeCarte } from "../../../test/cardTestKit";

describe("AC2 - ton info", () => {
  it("accepte info dans les types publics de ton", () => {
    const tonDeCarte: CanopCardTone = "info";
    const tonDeLegende: CanopLegendTone = "info";
    expect([tonDeCarte, tonDeLegende]).toEqual(["info", "info"]);
  });

  it("teinte une Card info d'un melange sur info-main", () => {
    const { container } = poser(<Card tone="info">Contenu</Card>);
    expect(fondsDe(racineDeCarte(container)).join(" ")).toContain(
      "color-mix(in srgb, var(--canop-palette-info-main) 8%, var(--canop-palette-background-paper))",
    );
  });

  it("teinte une StatCard info d'un melange sur info-main", () => {
    const { container } = poser(<StatCard label="A" value="1" tone="info" />);
    expect(fondsDe(racineDeCarte(container)).join(" ")).toContain("var(--canop-palette-info-main)");
  });

  it.each([
    ["clair", palette],
    ["sombre", paletteDark],
  ] as const)("garde le texte AA sur le fond info en mode %s", (_mode, jeu) => {
    const fond = mixSrgb(jeu.info.main, 0.08, jeu.background.paper);
    expect(contrastRatio(jeu.text.primary, fond)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(jeu.text.secondary, fond)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("AC3 - data-tone sur la racine de Card", () => {
  it("vaut neutral par defaut", () => {
    const { container } = poser(<Card>Contenu</Card>);
    expect(racineDeCarte(container)).toHaveAttribute("data-tone", "neutral");
  });

  it.each(["neutral", "info", "success", "warning", "error"] as const)("suit le ton %s", (tone) => {
    const { container } = poser(<Card tone={tone}>Contenu</Card>);
    expect(racineDeCarte(container)).toHaveAttribute("data-tone", tone);
  });

  it("refuse data-tone parmi les props du consommateur", () => {
    expectTypeOf<CanopCardProps>().toHaveProperty("data-tone");
    expectTypeOf<NonNullable<CanopCardProps["data-tone"]>>().toBeNever();
  });

  it("pose le ton de la StatCard sur sa racine", () => {
    const { container } = poser(<StatCard label="A" value="1" tone="info" />);
    expect(racineDeCarte(container)).toHaveAttribute("data-tone", "info");
  });

  it.each(["success", "error"] as const)(
    "garde une Card interactive cliquable avec flash %s",
    async (flash) => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { container } = poser(
        <Card variant="interactive" flash={flash} tone="info" onClick={onClick}>
          Contenu
        </Card>,
      );
      await user.click(screen.getByText("Contenu"));
      expect(onClick).toHaveBeenCalledOnce();
      expect(racineDeCarte(container)).toHaveAttribute("data-tone", "info");
    },
  );
});
