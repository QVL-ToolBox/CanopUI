import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { SelectionBar } from "../SelectionBar";
import type { CanopSelectionAction } from "../selectionTypes";

function renderBar(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function stubCompactViewport() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

const actions: CanopSelectionAction[] = [
  { id: "download", label: "Télécharger", icon: "download", onClick: () => undefined },
  { id: "delete", label: "Supprimer", icon: "trash", onClick: () => undefined, danger: true },
];

describe("SelectionBar", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reste masquée quand aucun élément n'est sélectionné", () => {
    renderBar(<SelectionBar count={0} actions={actions} onClear={() => undefined} />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("s'affiche avec le compte sélectionné dès qu'un élément est choisi", () => {
    renderBar(<SelectionBar count={3} actions={actions} onClear={() => undefined} />);
    expect(screen.getByRole("region", { name: "3 sélectionné(s)" })).toBeInTheDocument();
    expect(screen.getByText("3 sélectionné(s)")).toBeInTheDocument();
  });

  it("utilise le libellé de compte personnalisé quand il est fourni", () => {
    renderBar(
      <SelectionBar
        count={2}
        actions={actions}
        onClear={() => undefined}
        countLabel={(count) => `${count} fichiers`}
      />,
    );
    expect(screen.getByText("2 fichiers")).toBeInTheDocument();
  });

  it("déclenche onClear via le bouton de désélection", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    renderBar(<SelectionBar count={1} actions={actions} onClear={onClear} />);
    await user.click(screen.getByRole("button", { name: "Tout désélectionner" }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("rend chaque action et déclenche son callback", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderBar(
      <SelectionBar
        count={1}
        actions={[{ id: "download", label: "Télécharger", onClick }]}
        onClear={() => undefined}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Télécharger" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("regroupe les actions non épinglées dans le menu de dépassement en vue compacte", async () => {
    stubCompactViewport();
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderBar(
      <SelectionBar
        count={1}
        actions={[
          {
            id: "download",
            label: "Télécharger",
            icon: "download",
            onClick: () => undefined,
            pinned: true,
          },
          { id: "delete", label: "Supprimer", icon: "trash", onClick, danger: true },
        ]}
        onClear={() => undefined}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Plus d'actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Supprimer" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
