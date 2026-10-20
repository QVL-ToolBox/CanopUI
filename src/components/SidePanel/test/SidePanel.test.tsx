import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { SidePanel } from "../SidePanel";

function renderPanel(ui: React.ReactElement) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("SidePanel", () => {
  it("affiche le titre et le contenu quand ouvert", () => {
    renderPanel(
      <SidePanel open onClose={() => {}} title="Modifier">
        <p>Contenu</p>
      </SidePanel>,
    );
    expect(screen.getByRole("heading", { name: "Modifier" })).toBeInTheDocument();
    expect(screen.getByText("Contenu")).toBeInTheDocument();
  });

  it("ne rend pas le contenu quand fermé", () => {
    renderPanel(
      <SidePanel open={false} onClose={() => {}} title="Modifier">
        <p>Contenu</p>
      </SidePanel>,
    );
    expect(screen.queryByText("Contenu")).not.toBeInTheDocument();
  });

  it("appelle onClose au clic sur le bouton fermer", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderPanel(
      <SidePanel open onClose={onClose} title="Modifier">
        <p>Contenu</p>
      </SidePanel>,
    );
    await user.click(screen.getByRole("button", { name: "Fermer le panneau" }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
