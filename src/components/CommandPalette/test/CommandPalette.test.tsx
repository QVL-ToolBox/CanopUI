import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within, fireEvent, renderHook, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { CommandPalette } from "../CommandPalette";
import { useCommandPalette } from "../useCommandPalette";
import type { CanopCommandItem } from "../commandPaletteTypes";

function buildItems(
  overrides: Partial<Record<string, Partial<CanopCommandItem>>> = {},
): CanopCommandItem[] {
  const base: CanopCommandItem[] = [
    { id: "new", label: "Nouveau", group: "Fichier", keywords: ["create"] },
    { id: "edit", label: "Éditer", group: "Fichier" },
    { id: "settings", label: "Paramètres", group: "Compte", keywords: ["config"] },
  ];
  return base.map((item) => ({ ...item, ...overrides[item.id] }));
}

interface RenderPaletteProps {
  open?: boolean;
  onClose?: () => void;
  onSelect?: (item: CanopCommandItem) => void;
  items?: CanopCommandItem[];
  placeholder?: string;
  emptyLabel?: string;
  locale?: "fr" | "en";
}

function renderPalette(props: RenderPaletteProps = {}) {
  const {
    open = true,
    onClose = vi.fn(),
    onSelect,
    items = buildItems(),
    placeholder,
    emptyLabel,
    locale = "fr",
  } = props;
  return render(
    <CanopI18nProvider locale={locale}>
      <CanopThemeProvider>
        <CommandPalette
          open={open}
          onClose={onClose}
          items={items}
          placeholder={placeholder}
          emptyLabel={emptyLabel}
          onSelect={onSelect}
        />
      </CanopThemeProvider>
    </CanopI18nProvider>,
  );
}

function activeOption() {
  return screen
    .getAllByRole("option")
    .find((option) => option.getAttribute("aria-selected") === "true");
}

const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;

describe("CommandPalette", () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  it("ne rend pas le dialog quand open est false", () => {
    renderPalette({ open: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("rend le dialog quand open est true", () => {
    renderPalette();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("nomme le dialog avec le libellé i18n de la palette", () => {
    renderPalette();
    expect(screen.getByRole("dialog", { name: "Palette de commandes" })).toBeInTheDocument();
  });

  it("traduit le libellé du dialog selon la locale", () => {
    renderPalette({ locale: "en" });
    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeInTheDocument();
  });

  it("distingue le nom du dialog de celui du champ de recherche", () => {
    renderPalette({ placeholder: "Chercher une commande" });
    const dialog = screen.getByRole("dialog", { name: "Palette de commandes" });
    expect(
      within(dialog).getByRole("combobox", { name: "Chercher une commande" }),
    ).toBeInTheDocument();
  });

  it("expose un motif combobox complet sur le champ de recherche", () => {
    renderPalette();
    const input = screen.getByRole("combobox", { name: "Rechercher…" });
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute("aria-haspopup", "listbox");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-controls", screen.getByRole("listbox").id);
  });

  it("replie le combobox et annonce le message vide sans résultat", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.type(screen.getByRole("combobox"), "zzzzz");

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).not.toHaveAttribute("aria-controls");
    expect(screen.getByRole("status")).toHaveTextContent("Aucun résultat");
  });

  it("nomme l'input avec le placeholder fourni", () => {
    renderPalette({ placeholder: "Chercher une commande" });
    expect(screen.getByLabelText("Chercher une commande")).toBeInTheDocument();
  });

  it("nomme l'input avec le placeholder i18n par défaut", () => {
    renderPalette();
    expect(screen.getByLabelText("Rechercher…")).toBeInTheDocument();
  });

  it("expose un listbox contenant des options avec aria-selected", () => {
    renderPalette();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    options.forEach((option) => expect(option).toHaveAttribute("aria-selected"));
  });

  it("affiche l'icône de l'item quand elle est fournie", () => {
    renderPalette({ items: [{ id: "alpha", label: "Alpha", icon: "search" }] });
    expect(screen.getByRole("option", { name: /Alpha/ }).querySelector("svg")).not.toBeNull();
  });

  it("n'affiche ni en-tête ni rappel de groupe pour un item sans groupe", () => {
    renderPalette({ items: [{ id: "alpha", label: "Alpha" }] });
    expect(screen.getByRole("listbox").textContent).toBe("Alpha");
  });

  it("pointe aria-activedescendant sur l'option surlignée quand il y a des résultats", () => {
    renderPalette();
    const input = screen.getByLabelText("Rechercher…");
    const highlighted = activeOption();
    expect(input).toHaveAttribute("aria-activedescendant", highlighted!.id);
  });

  it("n'expose pas aria-activedescendant quand la liste est vide", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.type(screen.getByLabelText("Rechercher…"), "zzzzz");
    expect(screen.getByLabelText("Rechercher…")).not.toHaveAttribute("aria-activedescendant");
  });

  it("filtre en ignorant la casse et les accents sur le label", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.type(screen.getByLabelText("Rechercher…"), "EDIT");
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Éditer");
  });

  it("filtre sur un mot-clé", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.type(screen.getByLabelText("Rechercher…"), "config");
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Paramètres");
  });

  it("filtre sur le nom de groupe", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.type(screen.getByLabelText("Rechercher…"), "compte");
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Paramètres");
  });

  it("groupe les résultats par groupe dans l'ordre de première apparition", () => {
    renderPalette();
    const listbox = screen.getByRole("listbox");
    const headers = within(listbox)
      .getAllByText(/^(Fichier|Compte)$/)
      .filter((element) => element.closest("[role='option']") === null);
    expect(headers.map((header) => header.textContent)).toEqual(["Fichier", "Compte"]);
  });

  it("déplace la surbrillance vers le bas avec wrap et preventDefault", () => {
    renderPalette();
    const input = screen.getByLabelText("Rechercher…");
    expect(activeOption()).toHaveTextContent("Nouveau");
    expect(fireEvent.keyDown(input, { key: "ArrowDown" })).toBe(false);
    expect(activeOption()).toHaveTextContent("Éditer");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(activeOption()).toHaveTextContent("Paramètres");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(activeOption()).toHaveTextContent("Nouveau");
  });

  it("déplace la surbrillance vers le haut avec wrap et preventDefault", () => {
    renderPalette();
    const input = screen.getByLabelText("Rechercher…");
    expect(activeOption()).toHaveTextContent("Nouveau");
    expect(fireEvent.keyDown(input, { key: "ArrowUp" })).toBe(false);
    expect(activeOption()).toHaveTextContent("Paramètres");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(activeOption()).toHaveTextContent("Éditer");
  });

  it("déclenche item.onSelect puis onSelect puis onClose dans l'ordre à la touche Enter", () => {
    const order: string[] = [];
    const itemSelect = vi.fn(() => order.push("item"));
    const onSelect = vi.fn(() => order.push("prop"));
    const onClose = vi.fn(() => order.push("close"));
    renderPalette({
      onClose,
      onSelect,
      items: buildItems({ new: { onSelect: itemSelect } }),
    });
    fireEvent.keyDown(screen.getByLabelText("Rechercher…"), { key: "Enter" });
    expect(order).toEqual(["item", "prop", "close"]);
  });

  it("déclenche la même séquence au clic sur une option", async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    const itemSelect = vi.fn(() => order.push("item"));
    const onSelect = vi.fn(() => order.push("prop"));
    const onClose = vi.fn(() => order.push("close"));
    renderPalette({
      onClose,
      onSelect,
      items: buildItems({ settings: { onSelect: itemSelect } }),
    });
    await user.click(screen.getByRole("option", { name: /Paramètres/ }));
    expect(order).toEqual(["item", "prop", "close"]);
  });

  it("met à jour la surbrillance au survol d'une option", () => {
    renderPalette();
    const target = screen.getByRole("option", { name: /Paramètres/ });
    fireEvent.mouseMove(target);
    expect(activeOption()).toHaveTextContent("Paramètres");
  });

  it("affiche l'emptyLabel fourni et aucune option sans résultat", async () => {
    const user = userEvent.setup();
    renderPalette({ emptyLabel: "Rien trouvé" });
    await user.type(screen.getByLabelText("Rechercher…"), "zzzzz");
    expect(screen.getByText("Rien trouvé")).toBeInTheDocument();
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  it("affiche le message vide i18n par défaut sans résultat", async () => {
    const user = userEvent.setup();
    renderPalette();
    await user.type(screen.getByLabelText("Rechercher…"), "zzzzz");
    expect(screen.getByText("Aucun résultat")).toBeInTheDocument();
  });

  it("réinitialise la requête et la surbrillance à la réouverture", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = renderPalette({ onClose });
    const input = screen.getByLabelText("Rechercher…") as HTMLInputElement;
    await user.type(input, "édit");
    fireEvent.keyDown(input, { key: "ArrowDown" });

    const closed = (
      <CanopI18nProvider locale="fr">
        <CanopThemeProvider>
          <CommandPalette open={false} onClose={onClose} items={buildItems()} />
        </CanopThemeProvider>
      </CanopI18nProvider>
    );
    rerender(closed);

    rerender(
      <CanopI18nProvider locale="fr">
        <CanopThemeProvider>
          <CommandPalette open onClose={onClose} items={buildItems()} />
        </CanopThemeProvider>
      </CanopI18nProvider>,
    );

    expect((screen.getByLabelText("Rechercher…") as HTMLInputElement).value).toBe("");
    expect(activeOption()).toHaveTextContent("Nouveau");
  });

  it("appelle onClose à la touche Échap", () => {
    const onClose = vi.fn();
    renderPalette({ onClose });
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});

describe("useCommandPalette", () => {
  beforeEach(() => {
    vi.spyOn(document, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("bascule open avec Ctrl+K et preventDefault", () => {
    const { result } = renderHook(() => useCommandPalette());
    expect(result.current.open).toBe(false);
    let event: boolean = true;
    act(() => {
      event = fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    });
    expect(event).toBe(false);
    expect(result.current.open).toBe(true);
    act(() => {
      fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    });
    expect(result.current.open).toBe(false);
  });

  it("bascule open avec Meta+K", () => {
    const { result } = renderHook(() => useCommandPalette());
    act(() => {
      fireEvent.keyDown(document, { key: "K", metaKey: true });
    });
    expect(result.current.open).toBe(true);
  });

  it("expose setOpen, toggle et close cohérents", () => {
    const { result } = renderHook(() => useCommandPalette());
    act(() => result.current.setOpen(true));
    expect(result.current.open).toBe(true);
    act(() => result.current.close());
    expect(result.current.open).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.open).toBe(true);
  });

  it("retire l'écouteur clavier au démontage", () => {
    const { unmount } = renderHook(() => useCommandPalette());
    unmount();
    expect(document.removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
  });
});
