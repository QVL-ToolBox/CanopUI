import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { ConfirmDialog } from "../ConfirmDialog";

const noop = () => undefined;

function renderDialog(error?: string) {
  render(
    <CanopThemeProvider>
      <ConfirmDialog open title="Supprimer ?" error={error} onConfirm={noop} onCancel={noop} />
    </CanopThemeProvider>,
  );
}

describe("ConfirmDialog - error", () => {
  it("affiche l'erreur dans un role alert", () => {
    renderDialog("Impossible de supprimer.");
    expect(screen.getByRole("alert")).toHaveTextContent("Impossible de supprimer.");
  });

  it("n'affiche aucune alerte sans erreur", () => {
    renderDialog();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
