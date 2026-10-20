import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { MenuItem } from "../../Menu";
import { FileCard } from "../FileCard";

function renderCard(ui: React.ReactElement) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("FileCard", () => {
  it("affiche le nom du fichier", () => {
    renderCard(<FileCard name="rapport.pdf" />);
    expect(screen.getByText("rapport.pdf")).toBeInTheDocument();
  });

  it("affiche les métadonnées quand elles sont fournies", () => {
    renderCard(<FileCard name="rapport.pdf" metadata="2,4 Mo" />);
    expect(screen.getByText("2,4 Mo")).toBeInTheDocument();
  });

  it("déclenche onOpen au clic sur la carte", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    renderCard(<FileCard name="rapport.pdf" onOpen={onOpen} />);
    await user.click(screen.getByRole("button", { name: "rapport.pdf" }));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("affiche l'aperçu image avec le nom en texte alternatif", () => {
    renderCard(<FileCard name="photo.jpg" kind="image" previewUrl="https://example.com/p.jpg" />);
    expect(screen.getByRole("img", { name: "photo.jpg" })).toBeInTheDocument();
  });

  it("dimensionne l'icône de repli sur la vignette, pas sur une taille fixe", () => {
    const { container } = renderCard(<FileCard name="archive.zip" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.parentElement).toHaveStyle({ width: "52%" });
  });

  it("sélectionne par appui long, sans ouvrir la carte", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onSelectionChange = vi.fn();
    const onOpen = vi.fn();
    renderCard(
      <FileCard
        name="rapport.pdf"
        selectOnLongPress
        onSelectionChange={onSelectionChange}
        onOpen={onOpen}
      />,
    );
    const carte = screen.getByRole("button", { name: "rapport.pdf" });

    fireEvent.pointerDown(carte, { clientX: 0, clientY: 0 });
    act(() => void vi.advanceTimersByTime(500));
    fireEvent.pointerUp(carte);
    fireEvent.click(carte);

    expect(onSelectionChange).toHaveBeenCalledWith(true);
    expect(onOpen).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("ne sélectionne pas quand le doigt glisse — c'est un défilement", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onSelectionChange = vi.fn();
    renderCard(
      <FileCard name="rapport.pdf" selectOnLongPress onSelectionChange={onSelectionChange} />,
    );
    const carte = screen.getByRole("button", { name: "rapport.pdf" });

    fireEvent.pointerDown(carte, { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(carte, { clientX: 0, clientY: 40 });
    act(() => void vi.advanceTimersByTime(500));

    expect(onSelectionChange).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("laisse un appui bref ouvrir la carte", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onOpen = vi.fn();
    renderCard(<FileCard name="rapport.pdf" selectOnLongPress onOpen={onOpen} />);
    const carte = screen.getByRole("button", { name: "rapport.pdf" });

    fireEvent.pointerDown(carte, { clientX: 0, clientY: 0 });
    act(() => void vi.advanceTimersByTime(120));
    fireEvent.pointerUp(carte);
    fireEvent.click(carte);

    expect(onOpen).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("sélectionne à la barre d'espace, sans ouvrir la carte", () => {
    const onSelectionChange = vi.fn();
    const onOpen = vi.fn();
    renderCard(
      <FileCard
        name="rapport.pdf"
        selectOnLongPress
        onSelectionChange={onSelectionChange}
        onOpen={onOpen}
      />,
    );

    fireEvent.keyDown(screen.getByRole("button", { name: "rapport.pdf" }), { key: " " });

    expect(onSelectionChange).toHaveBeenCalledWith(true);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("désélectionne à la barre d'espace une carte déjà sélectionnée", () => {
    const onSelectionChange = vi.fn();
    renderCard(
      <FileCard
        name="rapport.pdf"
        selectOnLongPress
        selected
        onSelectionChange={onSelectionChange}
      />,
    );

    fireEvent.keyDown(screen.getByRole("button", { name: "rapport.pdf" }), { key: " " });

    expect(onSelectionChange).toHaveBeenCalledWith(false);
  });

  it("laisse Entrée ouvrir la carte même en sélection au clavier", () => {
    const onSelectionChange = vi.fn();
    const onOpen = vi.fn();
    renderCard(
      <FileCard
        name="rapport.pdf"
        selectOnLongPress
        onSelectionChange={onSelectionChange}
        onOpen={onOpen}
      />,
    );

    fireEvent.keyDown(screen.getByRole("button", { name: "rapport.pdf" }), { key: "Enter" });

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("laisse la barre d'espace ouvrir la carte sans selectOnLongPress", () => {
    const onOpen = vi.fn();
    renderCard(<FileCard name="rapport.pdf" onOpen={onOpen} />);

    fireEvent.keyDown(screen.getByRole("button", { name: "rapport.pdf" }), { key: " " });

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("laisse la case à cocher gérer la barre d'espace", () => {
    const onSelectionChange = vi.fn();
    renderCard(
      <FileCard
        name="rapport.pdf"
        selectable
        selectOnLongPress
        onSelectionChange={onSelectionChange}
      />,
    );

    fireEvent.keyDown(screen.getByRole("checkbox", { name: "Sélectionner le fichier" }), {
      key: " ",
    });

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("n'intercepte pas la barre d'espace dans le menu d'actions", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    renderCard(
      <FileCard
        name="rapport.pdf"
        selectOnLongPress
        onSelectionChange={onSelectionChange}
        menu={<MenuItem label="Renommer" onClick={() => {}} />}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Actions du fichier" }));
    fireEvent.keyDown(screen.getByRole("menuitem", { name: "Renommer" }), { key: " " });

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("expose une case à sélectionner quand selectable est actif", () => {
    renderCard(<FileCard name="rapport.pdf" selectable />);
    expect(screen.getByRole("checkbox", { name: "Sélectionner le fichier" })).toBeInTheDocument();
  });

  it("reflète l'état sélectionné sur la case", () => {
    renderCard(<FileCard name="rapport.pdf" selectable selected />);
    expect(screen.getByRole("checkbox", { name: "Sélectionner le fichier" })).toBeChecked();
  });

  it("notifie le changement de sélection sans ouvrir la carte", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const onOpen = vi.fn();
    renderCard(
      <FileCard
        name="rapport.pdf"
        selectable
        onSelectionChange={onSelectionChange}
        onOpen={onOpen}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: "Sélectionner le fichier" }));
    expect(onSelectionChange).toHaveBeenCalledWith(true);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("accepte des libellés personnalisés pour la case et le menu", () => {
    renderCard(
      <FileCard
        name="rapport.pdf"
        selectable
        selectLabel="Cocher le fichier"
        menuLabel="Options"
        menu={<MenuItem label="Renommer" />}
      />,
    );

    expect(screen.getByRole("checkbox", { name: "Cocher le fichier" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Options" })).toBeInTheDocument();
  });

  it("ouvre le menu d'actions sans déclencher l'ouverture de la carte", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    renderCard(<FileCard name="rapport.pdf" onOpen={onOpen} menu={<div>Renommer</div>} />);
    await user.click(screen.getByRole("button", { name: "Actions du fichier" }));
    expect(screen.getByText("Renommer")).toBeInTheDocument();
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("déclenche l'action puis referme le menu au clic sur un item", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    renderCard(
      <FileCard name="rapport.pdf" menu={<MenuItem label="Renommer" onClick={onRename} />} />,
    );
    await user.click(screen.getByRole("button", { name: "Actions du fichier" }));
    const item = screen.getByRole("menuitem", { name: "Renommer" });
    expect(item).toBeInTheDocument();
    await user.click(item);
    expect(onRename).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("garde le menu ouvert et n'appelle pas l'action pour un item désactivé", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    renderCard(
      <FileCard
        name="rapport.pdf"
        menu={<MenuItem label="Renommer" onClick={onRename} disabled />}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Actions du fichier" }));
    const item = screen.getByRole("menuitem", { name: "Renommer" });
    await expect(user.click(item)).rejects.toThrow();
    expect(onRename).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});
