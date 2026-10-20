import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Streak } from "../Streak";

function poser(ui: React.ReactNode, locale: "fr" | "en" = "fr") {
  return render(
    <CanopThemeProvider>
      <CanopI18nProvider locale={locale}>{ui}</CanopI18nProvider>
    </CanopThemeProvider>,
  );
}

describe("Streak", () => {
  it("affiche la longueur de la série", () => {
    poser(<Streak value={7} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("s'annonce comme un état", () => {
    poser(<Streak value={7} />);
    expect(screen.getByRole("status", { name: "Série de 7" })).toBeInTheDocument();
  });

  it("cache le multiplicateur tant qu'il ne multiplie rien", () => {
    poser(<Streak value={2} multiplier={1} />);
    expect(screen.queryByText(/×/)).not.toBeInTheDocument();
  });

  it("montre le multiplicateur dès qu'il dépasse un", () => {
    poser(<Streak value={6} multiplier={3} />);
    expect(screen.getByText("×3")).toBeInTheDocument();
  });

  it("déduit l'état chaud du multiplicateur, sans seconde source", () => {
    const froid = poser(<Streak value={2} />);
    expect(froid.container.querySelector("svg")).toBeInTheDocument();

    poser(<Streak value={9} multiplier={4} />);
    expect(screen.getByText("×4")).toBeInTheDocument();
  });

  it("suit la langue courante", () => {
    poser(<Streak value={5} />, "en");
    expect(screen.getByRole("status", { name: "Streak of 5" })).toBeInTheDocument();
  });
});
