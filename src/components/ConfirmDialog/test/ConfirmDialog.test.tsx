import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { ConfirmDialog } from "../ConfirmDialog";

function renderDialog(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const noop = () => undefined;

describe("ConfirmDialog", () => {
  it("affiche titre, message et boutons quand ouvert", () => {
    renderDialog(
      <ConfirmDialog
        open
        title="Supprimer ?"
        message="Action définitive."
        onConfirm={noop}
        onCancel={noop}
      />,
    );
    expect(screen.getByText("Supprimer ?")).toBeInTheDocument();
    expect(screen.getByText("Action définitive.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmer" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Annuler" })).toBeInTheDocument();
  });

  it("ne rend rien quand fermé", () => {
    renderDialog(<ConfirmDialog open={false} title="Caché" onConfirm={noop} onCancel={noop} />);
    expect(screen.queryByText("Caché")).not.toBeInTheDocument();
  });

  it("déclenche onConfirm et onCancel", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    renderDialog(
      <ConfirmDialog
        open
        title="T"
        confirmLabel="Valider"
        cancelLabel="Annuler"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Valider" }));
    await user.click(screen.getByRole("button", { name: "Annuler" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("applique la variante danger pour une action destructrice", () => {
    renderDialog(
      <ConfirmDialog
        open
        title="T"
        destructive
        confirmLabel="Supprimer"
        onConfirm={noop}
        onCancel={noop}
      />,
    );
    expect(screen.getByRole("button", { name: "Supprimer" }).className).toContain("colorError");
  });

  it("verrouille l'annulation et affiche un indicateur quand loading", () => {
    renderDialog(
      <ConfirmDialog
        open
        title="T"
        loading
        confirmLabel="Valider"
        onConfirm={noop}
        onCancel={noop}
      />,
    );
    expect(screen.getByRole("button", { name: "Annuler" })).toBeDisabled();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
