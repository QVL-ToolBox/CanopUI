import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { StatusChip } from "../StatusChip";

function renderChip(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("StatusChip", () => {
  it("affiche le libellé", () => {
    renderChip(<StatusChip label="Actif" tone="success" />);
    expect(screen.getByText("Actif")).toBeInTheDocument();
  });

  it.each([
    ["success", "colorSuccess"],
    ["warning", "colorWarning"],
    ["error", "colorError"],
    ["info", "colorInfo"],
  ] as const)("mappe la tonalité %s sur la couleur MUI", (tone, klass) => {
    const { container } = renderChip(<StatusChip tone={tone} label="x" />);
    expect(container.querySelector(".MuiChip-root")!.className).toContain(klass);
  });

  it("utilise la couleur par défaut pour neutral", () => {
    const { container } = renderChip(<StatusChip tone="neutral" label="x" />);
    expect(container.querySelector(".MuiChip-root")!.className).toContain("colorDefault");
  });
});
