import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Dropzone } from "../Dropzone";

function renderDropzone(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function fileInput(container: HTMLElement): HTMLInputElement {
  return container.querySelector('input[type="file"]') as HTMLInputElement;
}

describe("Dropzone", () => {
  it("rend une zone cliquable étiquetée avec le titre", () => {
    renderDropzone(
      <Dropzone onFiles={() => undefined} title="Déposer des fichiers" hint="ou cliquer" />,
    );
    expect(screen.getByRole("button", { name: "Déposer des fichiers" })).toBeInTheDocument();
    expect(screen.getByText("ou cliquer")).toBeInTheDocument();
  });

  it("transmet les fichiers choisis via le sélecteur", async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    const { container } = renderDropzone(<Dropzone onFiles={onFiles} title="Déposer" />);
    await user.upload(fileInput(container), new File(["a"], "a.txt", { type: "text/plain" }));
    expect(onFiles).toHaveBeenCalledTimes(1);
    expect(onFiles.mock.calls[0][0]).toHaveLength(1);
  });

  it("ne conserve qu'un fichier quand multiple est désactivé", async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    const { container } = renderDropzone(
      <Dropzone onFiles={onFiles} title="Déposer" multiple={false} />,
    );
    await user.upload(fileInput(container), new File(["a"], "a.txt", { type: "text/plain" }));
    expect(onFiles.mock.calls[0][0]).toHaveLength(1);
  });

  it("affiche l'overlay de dépôt pendant le survol de glisser", () => {
    renderDropzone(
      <Dropzone onFiles={() => undefined} title="Déposer" overlayLabel="Relâchez ici" />,
    );
    fireEvent.dragEnter(screen.getByRole("button", { name: "Déposer" }), {
      dataTransfer: { types: ["Files"], files: [] },
    });
    expect(screen.getByText("Relâchez ici")).toBeInTheDocument();
  });

  it("transmet les fichiers déposés par glisser-déposer", () => {
    const onFiles = vi.fn();
    renderDropzone(<Dropzone onFiles={onFiles} title="Déposer" />);
    const zone = screen.getByRole("button", { name: "Déposer" });
    fireEvent.dragOver(zone, {
      dataTransfer: { types: ["Files"], files: [] },
    });
    fireEvent.drop(zone, {
      dataTransfer: { types: ["Files"], files: [new File(["a"], "a.txt", { type: "text/plain" })] },
    });
    expect(onFiles).toHaveBeenCalledTimes(1);
    expect(onFiles.mock.calls[0][0]).toHaveLength(1);
  });

  it("ignore un glisser interne sans fichier et ne déclenche pas onFiles", () => {
    const onFiles = vi.fn();
    renderDropzone(<Dropzone onFiles={onFiles} title="Déposer" overlayLabel="Relâchez ici" />);
    const zone = screen.getByRole("button", { name: "Déposer" });
    fireEvent.dragEnter(zone, { dataTransfer: { types: ["text/plain"] } });
    fireEvent.dragOver(zone, { dataTransfer: { types: ["text/plain"] } });
    expect(screen.queryByText("Relâchez ici")).not.toBeInTheDocument();
    fireEvent.drop(zone, { dataTransfer: { types: ["text/plain"], files: [] } });
    expect(onFiles).not.toHaveBeenCalled();
  });

  it("désactive l'interaction et ignore les dépôts quand disabled", () => {
    const onFiles = vi.fn();
    renderDropzone(<Dropzone onFiles={onFiles} title="Déposer" disabled />);
    const zone = screen.getByRole("button", { name: "Déposer" });
    expect(zone).toHaveAttribute("aria-disabled", "true");
    expect(zone).toHaveAttribute("tabindex", "-1");
    fireEvent.drop(zone, {
      dataTransfer: { types: ["Files"], files: [new File(["a"], "a.txt", { type: "text/plain" })] },
    });
    expect(onFiles).not.toHaveBeenCalled();
  });
});
