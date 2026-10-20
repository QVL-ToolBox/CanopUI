import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { CanopThemeProvider } from "../../../theme";
import { Button } from "../../Button";
import { Card } from "../Card";

function renderCard(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function getCardRoot(container: HTMLElement) {
  return container.querySelector(".MuiCard-root") as HTMLElement;
}

describe("Card", () => {
  it("rend le contenu", () => {
    renderCard(<Card>Contenu de la carte</Card>);
    expect(screen.getByText("Contenu de la carte")).toBeInTheDocument();
  });

  it("affiche l'en-tête avec titre et sous-titre", () => {
    renderCard(
      <Card title="Mon compte" subtitle="Informations personnelles">
        Contenu
      </Card>,
    );
    expect(screen.getByText("Mon compte")).toBeInTheDocument();
    expect(screen.getByText("Informations personnelles")).toBeInTheDocument();
  });

  it("n'affiche pas d'en-tête sans titre", () => {
    const { container } = renderCard(<Card>Contenu</Card>);
    expect(container.querySelector(".MuiCardHeader-root")).not.toBeInTheDocument();
  });

  it("affiche la zone d'actions et relaie les clics", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = renderCard(
      <Card title="Confirmation" actions={<Button onClick={onClick}>Valider</Button>}>
        Êtes-vous sûr ?
      </Card>,
    );
    expect(container.querySelector(".MuiCardActions-root")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Valider" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("n'affiche pas de zone d'actions par défaut", () => {
    const { container } = renderCard(<Card>Contenu</Card>);
    expect(container.querySelector(".MuiCardActions-root")).not.toBeInTheDocument();
  });

  it("n'utilise pas l'élévation MUI (ombre centrée custom)", () => {
    const { container } = renderCard(<Card>Contenu</Card>);
    expect(getCardRoot(container).className).toContain("MuiPaper-elevation0");
  });

  it.each(["none", "sm", "md", "lg"] as const)("rend l'élévation %s", (elevation) => {
    const { container } = renderCard(<Card elevation={elevation}>Contenu</Card>);
    expect(getCardRoot(container).className).toContain("MuiPaper-elevation0");
    expect(screen.getByText("Contenu")).toBeInTheDocument();
  });
});
