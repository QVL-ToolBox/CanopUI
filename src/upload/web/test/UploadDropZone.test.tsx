import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CanopThemeProvider } from "../../../theme";
import { UploadDropZone } from "../UploadDropZone";

function fileListOf(files: File[]): FileList {
  return {
    length: files.length,
    item: (index: number) => files[index] ?? null,
  } as unknown as FileList;
}

function makeFile(name = "video.mp4"): File {
  return new File(["abc"], name, { type: "video/mp4" });
}

function spyOnPicker() {
  return vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => undefined);
}

function renderZone(props: Partial<React.ComponentProps<typeof UploadDropZone>> = {}) {
  const onFileSelected = props.onFileSelected ?? vi.fn();
  const view = render(
    <CanopThemeProvider>
      <UploadDropZone
        title="Deposez un fichier"
        hint="Jusqu'a 10 Gio"
        {...props}
        onFileSelected={onFileSelected}
      />
    </CanopThemeProvider>,
  );
  const zone = screen.getByRole("button");
  const input = view.container.querySelector('input[type="file"]') as HTMLInputElement;
  return { ...view, zone, input, onFileSelected };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("UploadDropZone - accessibilite", () => {
  it("expose le titre comme nom accessible par defaut", () => {
    renderZone();
    expect(screen.getByRole("button", { name: "Deposez un fichier" })).toBeInTheDocument();
  });

  it("laisse un libelle explicite primer sur le titre", () => {
    renderZone({ ariaLabel: "Zone de depot" });
    expect(screen.getByRole("button", { name: "Zone de depot" })).toBeInTheDocument();
  });

  it("reste atteignable au clavier", () => {
    const { zone } = renderZone();
    expect(zone).toHaveAttribute("tabindex", "0");
    expect(zone).toHaveAttribute("aria-disabled", "false");
  });

  it("sort du parcours clavier quand elle est desactivee", () => {
    const { zone } = renderZone({ disabled: true });
    expect(zone).toHaveAttribute("tabindex", "-1");
    expect(zone).toHaveAttribute("aria-disabled", "true");
  });

  it("affiche le texte d'aide", () => {
    renderZone();
    expect(screen.getByText("Jusqu'a 10 Gio")).toBeInTheDocument();
  });
});

describe("UploadDropZone - ouverture du selecteur", () => {
  it("ouvre le selecteur au clic", async () => {
    const openPicker = spyOnPicker();
    const { zone } = renderZone();
    await userEvent.click(zone);
    expect(openPicker).toHaveBeenCalledOnce();
  });

  it.each(["Enter", " "])("ouvre le selecteur avec la touche %p", (key) => {
    const openPicker = spyOnPicker();
    const { zone } = renderZone();
    fireEvent.keyDown(zone, { key });
    expect(openPicker).toHaveBeenCalledOnce();
  });

  it("ignore les autres touches", () => {
    const openPicker = spyOnPicker();
    const { zone } = renderZone();
    fireEvent.keyDown(zone, { key: "Escape" });
    expect(openPicker).not.toHaveBeenCalled();
  });

  it("n'ouvre pas le selecteur quand la zone est desactivee", async () => {
    const openPicker = spyOnPicker();
    const { zone } = renderZone({ disabled: true });
    await userEvent.click(zone);
    fireEvent.keyDown(zone, { key: "Enter" });
    expect(openPicker).not.toHaveBeenCalled();
  });
});

describe("UploadDropZone - selection par le champ fichier", () => {
  it("remonte le fichier choisi", () => {
    const onFileSelected = vi.fn();
    const { input } = renderZone({ onFileSelected });
    const file = makeFile();
    fireEvent.change(input, { target: { files: fileListOf([file]) } });
    expect(onFileSelected).toHaveBeenCalledWith(file);
  });

  it("ne remonte rien quand la selection est vide", () => {
    const onFileSelected = vi.fn();
    const { input } = renderZone({ onFileSelected });
    fireEvent.change(input, { target: { files: fileListOf([]) } });
    expect(onFileSelected).not.toHaveBeenCalled();
  });

  it("vide le champ pour permettre de reselectionner le meme fichier", () => {
    const { input } = renderZone();
    fireEvent.change(input, { target: { files: fileListOf([makeFile()]) } });
    expect(input.value).toBe("");
  });

  it("desactive le champ fichier avec la zone", () => {
    const { input } = renderZone({ disabled: true });
    expect(input).toBeDisabled();
  });
});

describe("UploadDropZone - glisser-deposer", () => {
  it("remonte le fichier depose", () => {
    const onFileSelected = vi.fn();
    const { zone } = renderZone({ onFileSelected });
    const file = makeFile();
    fireEvent.drop(zone, { dataTransfer: { files: fileListOf([file]) } });
    expect(onFileSelected).toHaveBeenCalledWith(file);
  });

  it("ignore un depot sans fichier", () => {
    const onFileSelected = vi.fn();
    const { zone } = renderZone({ onFileSelected });
    fireEvent.drop(zone, { dataTransfer: { files: fileListOf([]) } });
    expect(onFileSelected).not.toHaveBeenCalled();
  });

  it("ignore un depot sur une zone desactivee", () => {
    const onFileSelected = vi.fn();
    const { zone } = renderZone({ onFileSelected, disabled: true });
    fireEvent.drop(zone, { dataTransfer: { files: fileListOf([makeFile()]) } });
    expect(onFileSelected).not.toHaveBeenCalled();
  });

  it("signale visuellement le survol d'un fichier", () => {
    const { zone } = renderZone();
    const initialClasses = zone.className;
    fireEvent.dragOver(zone);
    expect(zone.className).not.toBe(initialClasses);
    fireEvent.dragLeave(zone);
    expect(zone.className).toBe(initialClasses);
  });

  it("ne signale aucun survol quand la zone est desactivee", () => {
    const { zone } = renderZone({ disabled: true });
    const initialClasses = zone.className;
    fireEvent.dragOver(zone);
    expect(zone.className).toBe(initialClasses);
  });
});
