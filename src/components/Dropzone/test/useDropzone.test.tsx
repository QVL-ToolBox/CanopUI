import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Dropzone } from "../Dropzone";

function renderDropzone(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function fileInput(container: HTMLElement): HTMLInputElement {
  return container.querySelector('input[type="file"]') as HTMLInputElement;
}

function textFile(name: string): File {
  return new File(["contenu"], name, { type: "text/plain" });
}

function filesTransfer(files: File[]) {
  return { dataTransfer: { types: ["Files"], files } };
}

const INTERNAL_TRANSFER = { dataTransfer: { types: ["text/plain"], files: [] } };

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Dropzone - nommage accessible", () => {
  it("nomme la zone avec son titre par defaut", () => {
    renderDropzone(<Dropzone onFiles={() => undefined} title="Deposer des fichiers" />);
    expect(screen.getByRole("button", { name: "Deposer des fichiers" })).toBeInTheDocument();
  });

  it("prefere ariaLabel au titre pour nommer la zone", () => {
    renderDropzone(
      <Dropzone onFiles={() => undefined} title="Deposer" ariaLabel="Televerser un justificatif" />,
    );
    expect(screen.getByRole("button", { name: "Televerser un justificatif" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Deposer" })).not.toBeInTheDocument();
  });

  it("n'affiche le texte d'aide que lorsqu'il est fourni", () => {
    const { rerender } = renderDropzone(<Dropzone onFiles={() => undefined} title="Deposer" />);
    expect(screen.queryByText("20 Mo maximum")).not.toBeInTheDocument();
    rerender(
      <CanopThemeProvider>
        <Dropzone onFiles={() => undefined} title="Deposer" hint="20 Mo maximum" />
      </CanopThemeProvider>,
    );
    expect(screen.getByText("20 Mo maximum")).toBeInTheDocument();
  });
});

describe("Dropzone - suivi du survol de glisser", () => {
  it("reprend le titre comme libelle du voile quand overlayLabel est absent", () => {
    const { container } = renderDropzone(
      <Dropzone onFiles={() => undefined} title="Deposer ici">
        <p>Contenu enveloppe</p>
      </Dropzone>,
    );
    const zone = container.firstElementChild as HTMLElement;
    fireEvent.dragEnter(zone, filesTransfer([]));
    expect(screen.getByText("Deposer ici")).toBeInTheDocument();
  });

  it("prefere overlayLabel au titre pour le voile", () => {
    renderDropzone(
      <Dropzone onFiles={() => undefined} title="Deposer" overlayLabel="Relachez ici" />,
    );
    fireEvent.dragEnter(screen.getByRole("button", { name: "Deposer" }), filesTransfer([]));
    expect(screen.getByText("Relachez ici")).toBeInTheDocument();
  });

  it("n'affiche aucun voile quand la zone est desactivee", () => {
    renderDropzone(
      <Dropzone onFiles={() => undefined} title="Deposer" overlayLabel="Relachez ici" disabled />,
    );
    fireEvent.dragEnter(screen.getByRole("button", { name: "Deposer" }), filesTransfer([]));
    expect(screen.queryByText("Relachez ici")).not.toBeInTheDocument();
  });

  it("maintient le voile tant que tous les glissers imbriques ne sont pas sortis", async () => {
    renderDropzone(
      <Dropzone onFiles={() => undefined} title="Deposer" overlayLabel="Relachez ici" />,
    );
    const zone = screen.getByRole("button", { name: "Deposer" });
    fireEvent.dragEnter(zone, filesTransfer([]));
    fireEvent.dragEnter(zone, filesTransfer([]));
    fireEvent.dragLeave(zone, filesTransfer([]));
    expect(screen.getByText("Relachez ici")).toBeInTheDocument();
    fireEvent.dragLeave(zone, filesTransfer([]));
    await waitFor(() => expect(screen.queryByText("Relachez ici")).not.toBeInTheDocument());
  });

  it("ignore une sortie de glisser sans fichier", () => {
    renderDropzone(
      <Dropzone onFiles={() => undefined} title="Deposer" overlayLabel="Relachez ici" />,
    );
    const zone = screen.getByRole("button", { name: "Deposer" });
    fireEvent.dragEnter(zone, filesTransfer([]));
    fireEvent.dragLeave(zone, INTERNAL_TRANSFER);
    expect(screen.getByText("Relachez ici")).toBeInTheDocument();
  });

  it("reste coherent apres une sortie de glisser survenue avant toute entree", async () => {
    renderDropzone(
      <Dropzone onFiles={() => undefined} title="Deposer" overlayLabel="Relachez ici" />,
    );
    const zone = screen.getByRole("button", { name: "Deposer" });
    fireEvent.dragLeave(zone, filesTransfer([]));
    fireEvent.dragEnter(zone, filesTransfer([]));
    expect(screen.getByText("Relachez ici")).toBeInTheDocument();
    fireEvent.dragLeave(zone, filesTransfer([]));
    await waitFor(() => expect(screen.queryByText("Relachez ici")).not.toBeInTheDocument());
  });

  it("n'ouvre pas le voile pour un glisser interne sans fichier", () => {
    renderDropzone(
      <Dropzone onFiles={() => undefined} title="Deposer" overlayLabel="Relachez ici" />,
    );
    const zone = screen.getByRole("button", { name: "Deposer" });
    fireEvent.dragEnter(zone, INTERNAL_TRANSFER);
    expect(screen.queryByText("Relachez ici")).not.toBeInTheDocument();
  });

  it("annonce la copie comme effet de depot pendant le survol", () => {
    renderDropzone(<Dropzone onFiles={() => undefined} title="Deposer" />);
    const transfer = { types: ["Files"], files: [], dropEffect: "none" };
    fireEvent.dragOver(screen.getByRole("button", { name: "Deposer" }), {
      dataTransfer: transfer,
    });
    expect(transfer.dropEffect).toBe("copy");
  });

  it("laisse l'effet de depot inchange quand la zone est desactivee", () => {
    renderDropzone(<Dropzone onFiles={() => undefined} title="Deposer" disabled />);
    const transfer = { types: ["Files"], files: [], dropEffect: "none" };
    fireEvent.dragOver(screen.getByRole("button", { name: "Deposer" }), {
      dataTransfer: transfer,
    });
    expect(transfer.dropEffect).toBe("none");
  });
});

describe("Dropzone - depot de fichiers", () => {
  it("transmet tous les fichiers deposes quand plusieurs sont autorises", () => {
    const onFiles = vi.fn();
    renderDropzone(<Dropzone onFiles={onFiles} title="Deposer" />);
    fireEvent.drop(
      screen.getByRole("button", { name: "Deposer" }),
      filesTransfer([textFile("a.txt"), textFile("b.txt")]),
    );
    expect(onFiles.mock.calls[0][0]).toHaveLength(2);
  });

  it("ne retient que le premier fichier depose quand multiple est desactive", () => {
    const onFiles = vi.fn();
    renderDropzone(<Dropzone onFiles={onFiles} title="Deposer" multiple={false} />);
    fireEvent.drop(
      screen.getByRole("button", { name: "Deposer" }),
      filesTransfer([textFile("a.txt"), textFile("b.txt")]),
    );
    const received = onFiles.mock.calls[0][0] as File[];
    expect(received).toHaveLength(1);
    expect(received[0].name).toBe("a.txt");
  });

  it("ne notifie rien pour un depot sans aucun fichier", () => {
    const onFiles = vi.fn();
    renderDropzone(<Dropzone onFiles={onFiles} title="Deposer" />);
    fireEvent.drop(screen.getByRole("button", { name: "Deposer" }), filesTransfer([]));
    expect(onFiles).not.toHaveBeenCalled();
  });

  it("accepte un depot sur une zone en mode enveloppe", () => {
    const onFiles = vi.fn();
    const { container } = renderDropzone(
      <Dropzone onFiles={onFiles} title="Deposer">
        <p>Contenu enveloppe</p>
      </Dropzone>,
    );
    fireEvent.drop(container.firstElementChild as HTMLElement, filesTransfer([textFile("a.txt")]));
    expect(onFiles).toHaveBeenCalledTimes(1);
  });

  it("referme le voile apres un depot", async () => {
    renderDropzone(
      <Dropzone onFiles={() => undefined} title="Deposer" overlayLabel="Relachez ici" />,
    );
    const zone = screen.getByRole("button", { name: "Deposer" });
    fireEvent.dragEnter(zone, filesTransfer([]));
    fireEvent.drop(zone, filesTransfer([textFile("a.txt")]));
    await waitFor(() => expect(screen.queryByText("Relachez ici")).not.toBeInTheDocument());
  });
});

describe("Dropzone - selection par le selecteur de fichiers", () => {
  it("transmet les contraintes de fichier au selecteur", () => {
    const { container } = renderDropzone(
      <Dropzone onFiles={() => undefined} title="Deposer" accept="image/png,image/jpeg" />,
    );
    expect(fileInput(container)).toHaveAttribute("accept", "image/png,image/jpeg");
    expect(fileInput(container)).toHaveAttribute("multiple");
  });

  it("interdit la selection multiple quand multiple est desactive", () => {
    const { container } = renderDropzone(
      <Dropzone onFiles={() => undefined} title="Deposer" multiple={false} />,
    );
    expect(fileInput(container)).not.toHaveAttribute("multiple");
  });

  it("ouvre le selecteur au clic sur la zone", async () => {
    const user = userEvent.setup();
    const openPicker = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
    renderDropzone(<Dropzone onFiles={() => undefined} title="Deposer" />);
    await user.click(screen.getByRole("button", { name: "Deposer" }));
    expect(openPicker).toHaveBeenCalled();
  });

  it("n'ouvre pas le selecteur au clic quand la zone est desactivee", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const openPicker = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
    renderDropzone(<Dropzone onFiles={() => undefined} title="Deposer" disabled />);
    await user.click(screen.getByRole("button", { name: "Deposer" }));
    expect(openPicker).not.toHaveBeenCalled();
  });

  it.each(["Enter", " "])("ouvre le selecteur avec la touche %s", (key) => {
    const openPicker = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
    renderDropzone(<Dropzone onFiles={() => undefined} title="Deposer" />);
    fireEvent.keyDown(screen.getByRole("button", { name: "Deposer" }), { key });
    expect(openPicker).toHaveBeenCalledTimes(1);
  });

  it("ignore les touches qui n'activent pas la zone", () => {
    const openPicker = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
    renderDropzone(<Dropzone onFiles={() => undefined} title="Deposer" />);
    fireEvent.keyDown(screen.getByRole("button", { name: "Deposer" }), { key: "Escape" });
    expect(openPicker).not.toHaveBeenCalled();
  });

  it("ignore le clavier quand la zone est desactivee", () => {
    const openPicker = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
    renderDropzone(<Dropzone onFiles={() => undefined} title="Deposer" disabled />);
    fireEvent.keyDown(screen.getByRole("button", { name: "Deposer" }), { key: "Enter" });
    expect(openPicker).not.toHaveBeenCalled();
  });

  it("sort la zone desactivee de l'ordre de tabulation", () => {
    renderDropzone(<Dropzone onFiles={() => undefined} title="Deposer" disabled />);
    expect(screen.getByRole("button", { name: "Deposer" })).toHaveAttribute("tabindex", "-1");
  });

  it("ne retient que le premier fichier choisi quand multiple est desactive", () => {
    const onFiles = vi.fn();
    const { container } = renderDropzone(
      <Dropzone onFiles={onFiles} title="Deposer" multiple={false} />,
    );
    fireEvent.change(fileInput(container), {
      target: { files: [textFile("a.txt"), textFile("b.txt")] },
    });
    expect(onFiles.mock.calls[0][0]).toHaveLength(1);
  });

  it("vide le selecteur apres une selection pour autoriser le meme fichier", async () => {
    const user = userEvent.setup();
    const { container } = renderDropzone(<Dropzone onFiles={() => undefined} title="Deposer" />);
    await user.upload(fileInput(container), textFile("a.txt"));
    expect(fileInput(container).value).toBe("");
  });

  it("ne notifie rien quand la selection est vide", () => {
    const onFiles = vi.fn();
    const { container } = renderDropzone(<Dropzone onFiles={onFiles} title="Deposer" />);
    fireEvent.change(fileInput(container), { target: { files: [] } });
    expect(onFiles).not.toHaveBeenCalled();
  });

  it("desactive le selecteur quand la zone est desactivee", () => {
    const { container } = renderDropzone(
      <Dropzone onFiles={() => undefined} title="Deposer" disabled />,
    );
    expect(fileInput(container)).toBeDisabled();
  });
});
