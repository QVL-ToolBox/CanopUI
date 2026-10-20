import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { SidePanelHeader } from "../SidePanelHeader";

function renderHeader(ui: ReactNode) {
  return render(
    <CanopI18nProvider locale="fr">
      <CanopThemeProvider>{ui}</CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

describe("SidePanelHeader", () => {
  it("demarre le glissement depuis n'importe ou dans l'en-tete, pas seulement la barrette", () => {
    const onStartDrag = vi.fn();
    renderHeader(
      <SidePanelHeader
        title="Modifier"
        titleId="t"
        showHandle
        onClose={vi.fn()}
        onStartDrag={onStartDrag}
      />,
    );
    fireEvent.pointerDown(screen.getByRole("heading", { name: "Modifier" }));
    expect(onStartDrag).toHaveBeenCalledOnce();
  });

  it("ne demarre pas de glissement depuis le bouton de fermeture", () => {
    const onStartDrag = vi.fn();
    const onClose = vi.fn();
    renderHeader(
      <SidePanelHeader
        title="Modifier"
        titleId="t"
        showHandle
        onClose={onClose}
        onStartDrag={onStartDrag}
      />,
    );
    const bouton = screen.getByRole("button", { name: "Fermer le panneau" });
    fireEvent.pointerDown(bouton);
    expect(onStartDrag).not.toHaveBeenCalled();
    fireEvent.click(bouton);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("n'expose aucun geste quand le panneau est un tiroir lateral", () => {
    renderHeader(
      <SidePanelHeader title="Modifier" titleId="t" showHandle={false} onClose={vi.fn()} />,
    );
    expect(screen.getByRole("heading", { name: "Modifier" })).toBeInTheDocument();
  });
});
