import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { SvgMap, type CanopSvgMapRegion } from "../SvgMap";

const REGIONS: CanopSvgMapRegion[] = [
  { id: "29", path: "M0 0 h10 v10 h-10 Z", name: "Finistère", ariaLabel: "Département 29" },
  { id: "75", path: "M20 0 h10 v10 h-10 Z", name: "Paris" },
  { id: "13", path: "M40 0 h10 v10 h-10 Z" },
  { id: "34", path: "M60 0 h10 v10 h-10 Z", ariaLabel: "Département à trouver" },
];

function poser(ui: React.ReactNode) {
  return render(
    <CanopThemeProvider>
      <CanopI18nProvider locale="fr">{ui}</CanopI18nProvider>
    </CanopThemeProvider>,
  );
}

function titresDe(container: HTMLElement): string[] {
  return Array.from(container.querySelector("svg")!.querySelectorAll("title")).map(
    (titre) => titre.textContent ?? "",
  );
}

describe("SvgMap — nom accessible d'une région", () => {
  it("préfère ariaLabel à name", () => {
    poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable />);
    expect(screen.getByRole("button", { name: "Département 29" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Finistère" })).toBeNull();
  });

  it("garde name comme nom accessible quand ariaLabel manque", () => {
    poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable />);
    expect(screen.getByRole("button", { name: "Paris" })).toBeInTheDocument();
  });

  it("garde l'identifiant en dernier recours", () => {
    poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable />);
    expect(screen.getByRole("button", { name: "13" })).toBeInTheDocument();
  });

  it("n'affiche jamais ariaLabel en infobulle", () => {
    const { container } = poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable />);
    const titres = titresDe(container);
    expect(titres).toContain("Finistère");
    expect(titres).not.toContain("Département 29");
    expect(titres).not.toContain("Département à trouver");
  });

  it("laisse une région sans nom visible étiquetée pour le lecteur d'écran", () => {
    const { container } = poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} selectable />);
    expect(screen.getByRole("button", { name: "Département à trouver" })).toBeInTheDocument();
    expect(titresDe(container)).not.toContain("34");
  });

  it("ne nomme pas les régions d'une carte non sélectionnable", () => {
    const { container } = poser(<SvgMap viewBox="0 0 100 50" regions={REGIONS} />);
    const traces = Array.from(container.querySelector("svg")!.querySelectorAll("path"));
    expect(traces.every((trace) => trace.getAttribute("aria-label") === null)).toBe(true);
  });
});
