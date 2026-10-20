import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { ProgressBar } from "../ProgressBar";
import type { CanopProgressSegment } from "../progressBarHelpers";

function renderBar(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("ProgressBar", () => {
  it("expose une barre de progression avec la valeur courante et ses bornes", () => {
    renderBar(<ProgressBar value={42} label="Chargement" />);
    const bar = screen.getByRole("progressbar", { name: "Chargement" });
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("plafonne une valeur supérieure à cent", () => {
    renderBar(<ProgressBar value={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("plancher une valeur négative à zéro", () => {
    renderBar(<ProgressBar value={-10} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("affiche le pourcentage textuel quand showValue est activé", () => {
    renderBar(<ProgressBar value={42} showValue />);
    expect(screen.getByText("42%")).toBeInTheDocument();
  });

  it("affiche le libellé fourni", () => {
    renderBar(<ProgressBar value={20} label="Téléversement" />);
    expect(screen.getByText("Téléversement")).toBeInTheDocument();
  });

  it("bascule en rendu segmenté quand des segments sont fournis", () => {
    const segments: CanopProgressSegment[] = [
      { value: 30, label: "Images", color: "primary" },
      { value: 20, label: "Documents", color: "accent" },
    ];
    renderBar(<ProgressBar segments={segments} label="Répartition" />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("construit un libellé accessible décrivant chaque segment", () => {
    const segments: CanopProgressSegment[] = [
      { value: 75, label: "Utilisé" },
      { value: 25, label: "Libre" },
    ];
    renderBar(<ProgressBar segments={segments} label="Stockage" />);
    expect(
      screen.getByRole("img", { name: "Stockage : Utilisé 75%, Libre 25%" }),
    ).toBeInTheDocument();
  });

  it("se laisse nommer sans libellé visible", () => {
    renderBar(<ProgressBar value={42} ariaLabel="Temps restant" />);
    expect(screen.getByRole("progressbar", { name: "Temps restant" })).toBeInTheDocument();
  });

  it("privilégie un ariaLabel explicite sur le libellé visible", () => {
    renderBar(
      <ProgressBar value={42} label="Chargement" ariaLabel="Progression du téléversement" />,
    );
    expect(
      screen.getByRole("progressbar", { name: "Progression du téléversement" }),
    ).toBeInTheDocument();
  });

  it("privilégie un ariaLabel explicite pour la barre segmentée", () => {
    const segments: CanopProgressSegment[] = [{ value: 100, label: "Complet" }];
    renderBar(<ProgressBar segments={segments} ariaLabel="Progression globale" />);
    expect(screen.getByRole("img", { name: "Progression globale" })).toBeInTheDocument();
  });

  it("porte un degre simple en statique, sans motif repete", () => {
    const { container } = renderBar(<ProgressBar value={40} label="Chargement" animated={false} />);
    const fill = container.querySelector("[data-sweep]") as HTMLElement;
    const style = getComputedStyle(fill);
    expect(style.backgroundSize).toBe("100% 100%");
    expect(style.backgroundRepeat).toBe("no-repeat");
  });

  it("ajoute un unique reflet quand elle defile, en second calque", () => {
    const { container } = renderBar(<ProgressBar value={40} label="Chargement" />);
    const style = getComputedStyle(container.querySelector("[data-sweep]") as HTMLElement);
    expect(style.backgroundSize).toBe("50% 100%, 100% 100%");
    expect(style.backgroundImage.split("linear-gradient")).toHaveLength(3);
    expect(style.backgroundImage).toContain("rgba(255, 255, 255, 0.55)");
  });

  it("fait defiler sa rampe quand elle est animee", () => {
    const { container } = renderBar(<ProgressBar value={40} label="Chargement" />);
    expect(container.querySelector("[data-sweep]")).toHaveAttribute("data-sweep", "on");
  });

  it("ne fait rien defiler quand animated vaut false", () => {
    const { container } = renderBar(<ProgressBar value={40} label="Chargement" animated={false} />);
    expect(container.querySelector("[data-sweep]")).toHaveAttribute("data-sweep", "off");
  });

  it("ne fait rien defiler quand l'utilisateur demande un mouvement reduit", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    const { container } = renderBar(<ProgressBar value={40} label="Chargement" />);
    expect(container.querySelector("[data-sweep]")).toHaveAttribute("data-sweep", "off");
  });
});
