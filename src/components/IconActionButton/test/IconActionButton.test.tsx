import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { derniereValeurDansLeGroupe } from "../../../test/cssRules";
import { IconActionButton } from "../IconActionButton";

function renderButton(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

const iconOf = (name: string) => screen.getByRole("button", { name }).querySelector("svg");

describe("IconActionButton", () => {
  it("rend un bouton avec le bon aria-label", () => {
    renderButton(<IconActionButton icon="trash" ariaLabel="Supprimer" />);
    expect(screen.getByRole("button", { name: "Supprimer" })).toBeInTheDocument();
  });

  it("appelle onClick au clic", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderButton(<IconActionButton icon="pencil" ariaLabel="Éditer" onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Éditer" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("est desactivable", () => {
    renderButton(<IconActionButton icon="trash" ariaLabel="Supprimer" disabled />);
    expect(screen.getByRole("button", { name: "Supprimer" })).toBeDisabled();
  });

  it("ne declenche pas onClick quand desactive", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    renderButton(
      <IconActionButton icon="trash" ariaLabel="Supprimer" disabled onClick={onClick} />,
    );
    await user.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("mesure deux virgule cinq rem de cote par defaut", () => {
    renderButton(<IconActionButton icon="pencil" ariaLabel="Éditer" />);
    expect(screen.getByRole("button", { name: "Éditer" })).toHaveStyle({
      width: "2.5rem",
      height: "2.5rem",
    });
  });

  it("adopte la taille demandee", () => {
    renderButton(<IconActionButton icon="pencil" ariaLabel="Éditer" size="3.25rem" />);
    expect(screen.getByRole("button", { name: "Éditer" })).toHaveStyle({
      width: "3.25rem",
      height: "3.25rem",
    });
  });

  it("dimensionne l'icone en md par defaut", () => {
    renderButton(<IconActionButton icon="pencil" ariaLabel="Éditer" />);
    expect(iconOf("Éditer")).toHaveAttribute("width", "1.5rem");
  });

  it("dimensionne l'icone selon iconSize", () => {
    renderButton(<IconActionButton icon="pencil" ariaLabel="Éditer" iconSize="xs" />);
    expect(iconOf("Éditer")).toHaveAttribute("width", "1rem");
  });

  it("conserve la taille d'icone demandee quand la taille du bouton change", () => {
    renderButton(<IconActionButton icon="pencil" ariaLabel="Éditer" size="4rem" iconSize="sm" />);
    expect(iconOf("Éditer")).toHaveAttribute("width", "1.25rem");
  });

  it("ne porte aucun anneau de focus", () => {
    renderButton(<IconActionButton icon="pencil" ariaLabel="Éditer" />);
    const bouton = screen.getByRole("button", { name: "Éditer" });

    expect(derniereValeurDansLeGroupe(bouton, "outline", ":focus-visible")).toMatch(
      /^(|none|0(px)?)$/,
    );
    expect(derniereValeurDansLeGroupe(bouton, "outline", ":focus")).toMatch(/^(|none|0(px)?)$/);
  });

  it("reprend au focus clavier le fond de son survol", () => {
    renderButton(<IconActionButton icon="pencil" ariaLabel="Éditer" />);
    const bouton = screen.getByRole("button", { name: "Éditer" });

    expect(
      derniereValeurDansLeGroupe(bouton, "background-color", ".Mui-focusVisible::before"),
    ).toBe(derniereValeurDansLeGroupe(bouton, "background-color", ":hover::before"));
  });
});
