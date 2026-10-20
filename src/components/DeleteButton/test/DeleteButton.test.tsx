import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { DeleteButton } from "../DeleteButton";

function renderButton(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

const iconOf = (name: string) => screen.getByRole("button", { name }).querySelector("svg");

describe("DeleteButton", () => {
  it("ouvre la pop-up au clic sans appeler onConfirm", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderButton(<DeleteButton ariaLabel="Supprimer l'élément" onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Supprimer l'élément" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("appelle onConfirm après validation de la pop-up", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderButton(<DeleteButton ariaLabel="Supprimer l'élément" onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Supprimer l'élément" }));

    await user.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("ferme la pop-up sans appeler onConfirm au clic sur Annuler", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderButton(<DeleteButton ariaLabel="Supprimer l'élément" onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: "Supprimer l'élément" }));
    await user.click(screen.getByRole("button", { name: "Annuler" }));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("mesure deux virgule cinq rem de cote par defaut", () => {
    renderButton(<DeleteButton ariaLabel="Supprimer" onConfirm={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Supprimer" })).toHaveStyle({
      width: "2.5rem",
      height: "2.5rem",
    });
  });

  it("adopte la taille demandee", () => {
    renderButton(<DeleteButton ariaLabel="Supprimer" size="4rem" onConfirm={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Supprimer" })).toHaveStyle({
      width: "4rem",
      height: "4rem",
    });
  });

  it("dimensionne l'icone en md par defaut", () => {
    renderButton(<DeleteButton ariaLabel="Supprimer" onConfirm={vi.fn()} />);
    expect(iconOf("Supprimer")).toHaveAttribute("width", "1.5rem");
  });

  it("transmet iconSize a l'icone", () => {
    renderButton(<DeleteButton ariaLabel="Supprimer" iconSize="lg" onConfirm={vi.fn()} />);
    expect(iconOf("Supprimer")).toHaveAttribute("width", "2rem");
  });
});
