import { describe, expect, it, vi } from "vitest";
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Button } from "../Button";
import { useButton } from "../useButton";

function renderButton(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Button", () => {
  it("rend le libellé", () => {
    renderButton(<Button>Connexion</Button>);
    expect(screen.getByRole("button", { name: "Connexion" })).toBeInTheDocument();
  });

  it("déclenche onClick au clic", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderButton(<Button onClick={onClick}>Valider</Button>);
    await user.click(screen.getByRole("button", { name: "Valider" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("ne déclenche pas onClick quand disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderButton(
      <Button onClick={onClick} disabled>
        Valider
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Valider" });
    expect(button).toBeDisabled();
    await user.click(button).catch(() => undefined);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("affiche un indicateur de chargement et bloque le clic quand loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderButton(
      <Button onClick={onClick} loading>
        Envoi
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    await user.click(button).catch(() => undefined);
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each(["primary", "secondary", "danger", "accent"] as const)(
    "rend la variante %s",
    (variant) => {
      renderButton(<Button variant={variant}>Action</Button>);
      expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
    },
  );

  it("applique la couleur erreur pour la variante danger", () => {
    renderButton(<Button variant="danger">Supprimer</Button>);
    expect(screen.getByRole("button", { name: "Supprimer" }).className).toContain("colorError");
  });

  it("applique la couleur secondary pour la variante secondary", () => {
    renderButton(<Button variant="secondary">Annuler</Button>);
    const className = screen.getByRole("button", { name: "Annuler" }).className;
    expect(className).toContain("colorSecondary");
    expect(className).toContain("contained");
  });

  it("applique la couleur accent pour la variante accent", () => {
    renderButton(<Button variant="accent">Se connecter</Button>);
    const className = screen.getByRole("button", { name: "Se connecter" }).className;
    expect(className).toContain("colorAccent");
    expect(className).toContain("contained");
  });

  it.each(["small", "medium", "large"] as const)("rend la taille %s", (size) => {
    renderButton(<Button size={size}>Action</Button>);
    const className = screen.getByRole("button", { name: "Action" }).className;
    expect(className.toLowerCase()).toContain(size.toLowerCase());
  });

  it("soumet un formulaire avec type submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    renderButton(
      <form onSubmit={onSubmit}>
        <Button type="submit">Envoyer</Button>
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Envoyer" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("occupe toute la largeur avec fullWidth", () => {
    renderButton(<Button fullWidth>Large</Button>);
    expect(screen.getByRole("button", { name: "Large" }).className).toContain("fullWidth");
  });
});

describe("Button - lisibilite de la variante secondary", () => {
  it("ecrit en blanc sur le fond du theme clair", () => {
    const { result } = renderHook(() => useButton("secondary", "medium"));
    const sx = result.current.sx as Record<string, unknown>;

    expect(sx.color).toBe("#ffffff");
  });

  it("prend son fond dans les variables de palette, non dans une variable maison", () => {
    const { result } = renderHook(() => useButton("secondary", "medium"));
    expect(JSON.stringify(result.current.sx)).not.toContain("--canop-button-secondary");
    expect(JSON.stringify(result.current.sx)).toContain("--canop-palette-secondary");
  });

  it("laisse les variantes a fond a la couleur du theme", () => {
    for (const variante of ["primary", "accent", "danger"] as const) {
      const { result } = renderHook(() => useButton(variante, "medium"));
      const sx = result.current.sx as Record<string, unknown>;
      expect(sx.color).toBeUndefined();
    }
  });

  it("donne aux variantes sans fond la couleur de texte du theme", () => {
    for (const variante of ["ghost", "text"] as const) {
      const { result } = renderHook(() => useButton(variante, "medium"));
      const sx = result.current.sx as Record<string, unknown>;
      expect(sx.color).toBe("var(--canop-palette-text-primary)");
    }
  });
});
