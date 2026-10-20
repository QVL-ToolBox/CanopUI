import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Legend } from "../Legend";
import { valeurFixe } from "../../../test/cssRules";

function renderLegend(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function pastilleDe(libelle: string): string {
  const entree = screen.getAllByRole("listitem").find((item) => item.textContent === libelle)!;
  return valeurFixe(entree.firstElementChild as HTMLElement, "background-color");
}

describe("Legend — entrées à couleur libre", () => {
  it("peint la pastille du jeton de thème demandé", () => {
    renderLegend(<Legend items={[{ color: "background.paper", label: "Au repos" }]} />);
    expect(pastilleDe("Au repos")).toBe("var(--canop-palette-background-paper)");
  });

  it("mélange tonalités et couleurs dans une même liste", () => {
    renderLegend(
      <Legend
        items={[
          { tone: "success", label: "Trouvé" },
          { color: "background.paper", label: "Au repos" },
          { tone: "error", label: "Manqué" },
          { color: "primary.light", label: "Survolé" },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(pastilleDe("Trouvé")).toBe("var(--canop-palette-success-main)");
    expect(pastilleDe("Au repos")).toBe("var(--canop-palette-background-paper)");
    expect(pastilleDe("Manqué")).toBe("var(--canop-palette-error-main)");
    expect(pastilleDe("Survolé")).toBe("var(--canop-palette-primary-light)");
  });
});
