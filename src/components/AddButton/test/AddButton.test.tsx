import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { AddButton } from "../AddButton";

function renderButton(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const iconOf = (name: string) => screen.getByRole("button", { name }).querySelector("svg");

describe("AddButton", () => {
  it("rend un bouton avec le bon aria-label", () => {
    renderButton(<AddButton ariaLabel="Ajouter" />);
    expect(screen.getByRole("button", { name: "Ajouter" })).toBeInTheDocument();
  });

  it("appelle onClick au clic", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderButton(<AddButton ariaLabel="Ajouter" onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Ajouter" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("est desactivable", () => {
    renderButton(<AddButton ariaLabel="Ajouter" disabled />);
    expect(screen.getByRole("button", { name: "Ajouter" })).toBeDisabled();
  });

  it("ne declenche pas onClick quand desactive", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    renderButton(<AddButton ariaLabel="Ajouter" disabled onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Ajouter" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("mesure deux virgule cinq rem de cote par defaut", () => {
    renderButton(<AddButton ariaLabel="Ajouter" />);
    expect(screen.getByRole("button", { name: "Ajouter" })).toHaveStyle({
      width: "2.5rem",
      height: "2.5rem",
    });
  });

  it("adopte la taille demandee", () => {
    renderButton(<AddButton ariaLabel="Ajouter" size="4rem" />);
    expect(screen.getByRole("button", { name: "Ajouter" })).toHaveStyle({
      width: "4rem",
      height: "4rem",
    });
  });

  it("dimensionne l'icone en md par defaut", () => {
    renderButton(<AddButton ariaLabel="Ajouter" />);
    expect(iconOf("Ajouter")).toHaveAttribute("width", "1.5rem");
  });

  it("transmet iconSize a l'icone", () => {
    renderButton(<AddButton ariaLabel="Ajouter" iconSize="xl" />);
    expect(iconOf("Ajouter")).toHaveAttribute("width", "3rem");
  });
});
