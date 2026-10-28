import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopI18nProvider, CanopThemeProvider } from "@canop/ui";
import AutocompleteDoc from "../AutocompleteDoc";
import InputDoc from "../InputDoc";

function monte(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function section(titre: string): HTMLElement {
  return screen.getByRole("heading", { level: 2, name: titre }).parentElement as HTMLElement;
}

describe("vitrine — AC15 page Autocomplete", () => {
  it("montre départements, villes, saisie répétée, hors liste et raccourcis", () => {
    monte(<AutocompleteDoc />);

    expect(screen.getByRole("textbox", { name: "Département" })).toBeTruthy();
    expect(screen.getAllByRole("textbox", { name: "Ville" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { level: 2, name: "Saisie répétée" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Hors liste" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Raccourcis" })).toBeTruthy();
  });

  it("n'affiche aucune liste déroulante dans ses démonstrations", () => {
    monte(<AutocompleteDoc />);

    expect(screen.queryByRole("combobox")).toBeNull();
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("retient Côte-d'Or en tapant « cote d » puis Tab", async () => {
    monte(<AutocompleteDoc />);
    const champ = screen.getByRole("textbox", { name: "Département" }) as HTMLInputElement;

    await userEvent.type(champ, "cote d");
    await userEvent.keyboard("{Tab}");

    expect(champ.value).toBe("Côte-d'Or");
    expect(
      screen
        .getAllByText("value")
        .some((pastille) => pastille.parentElement?.textContent === "value21"),
    ).toBe(true);
  });
});

describe("vitrine — AC15 page Input", () => {
  it("a une section complétion qui renvoie vers Autocomplete", () => {
    monte(<InputDoc />);

    expect(section("Autocomplétion en ligne").textContent).toContain("Autocomplete");
  });
});
