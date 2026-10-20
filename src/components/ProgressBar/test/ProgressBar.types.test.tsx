import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { ProgressBar } from "../ProgressBar";
import type { CanopProgressSegment } from "../progressBarHelpers";

const segments: CanopProgressSegment[] = [
  { value: 30, label: "Images", color: "primary" },
  { value: 20, label: "Documents", color: "accent" },
];

function renderBar(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("ProgressBar — les props des deux formes ne se mélangent plus", () => {
  it("refuse max sur une barre simple", () => {
    renderBar(
      // @ts-expect-error la barre simple ne lit pas max, elle ne l'accepte plus
      <ProgressBar value={50} max={101} />,
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "100");
  });

  it("refuse showValue sur une barre segmentée", () => {
    renderBar(
      // @ts-expect-error showValue n'appartient qu'à la barre simple
      <ProgressBar segments={segments} showValue />,
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("laisse la barre simple inchangée avec value seul", () => {
    renderBar(<ProgressBar value={50} showValue label="Acquis" />);
    const bar = screen.getByRole("progressbar", { name: "Acquis" });
    expect(bar).toHaveAttribute("aria-valuenow", "50");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(screen.getByText("50%")).toBeInTheDocument();
  });
});
