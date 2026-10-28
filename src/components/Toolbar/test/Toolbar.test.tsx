import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { Toolbar } from "../Toolbar";
import type { CanopToolbarAction } from "../toolbarTypes";

function renderToolbar(ui: React.ReactElement) {
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

const sortOptions = [
  { id: "name", label: "Nom" },
  { id: "date", label: "Date" },
];

describe("Toolbar", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rend un conteneur toolbar avec le libellé fourni", () => {
    renderToolbar(<Toolbar ariaLabel="Actions de la liste" />);
    expect(screen.getByRole("toolbar", { name: "Actions de la liste" })).toBeInTheDocument();
  });

  it("affiche un champ de recherche avec le placeholder fourni", () => {
    renderToolbar(
      <Toolbar
        search={{ value: "", onChange: () => undefined, placeholder: "Rechercher un fichier" }}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Rechercher un fichier" })).toBeInTheDocument();
  });

  it("propage la saisie dans le champ de recherche via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderToolbar(<Toolbar search={{ value: "", onChange }} />);
    await user.type(screen.getByRole("textbox"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("efface la recherche via le bouton dédié quand une valeur est présente", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderToolbar(<Toolbar search={{ value: "rapport", onChange }} />);
    await user.click(screen.getByRole("button", { name: "Effacer la recherche" }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("n'affiche pas le bouton d'effacement quand la recherche est vide", () => {
    renderToolbar(<Toolbar search={{ value: "", onChange: () => undefined }} />);
    expect(screen.queryByRole("button", { name: "Effacer la recherche" })).not.toBeInTheDocument();
  });

  it("affiche l'option de tri active et sélectionne une autre option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderToolbar(<Toolbar sort={{ options: sortOptions, value: "name", onChange }} />);
    expect(screen.getByRole("button", { name: "Trier" })).toHaveTextContent("Nom");
    await user.click(screen.getByRole("button", { name: "Trier" }));
    await user.click(screen.getByRole("menuitem", { name: "Date" }));
    expect(onChange).toHaveBeenCalledWith("date");
  });

  it("inverse le sens de tri via le bouton de direction", async () => {
    const user = userEvent.setup();
    const onDirectionChange = vi.fn();
    renderToolbar(
      <Toolbar
        sort={{
          options: sortOptions,
          value: "name",
          onChange: () => undefined,
          direction: "asc",
          onDirectionChange,
        }}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Tri croissant" }));
    expect(onDirectionChange).toHaveBeenCalledWith("desc");
  });

  it("expose la bascule d'affichage en radiogroup avec l'option active cochée", () => {
    renderToolbar(<Toolbar view={{ value: "grid", onChange: () => undefined }} />);
    expect(screen.getByRole("radiogroup", { name: "Affichage" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Vue grille" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Vue liste" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("change d'affichage au clic sur une option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderToolbar(<Toolbar view={{ value: "grid", onChange }} />);
    await user.click(screen.getByRole("radio", { name: "Vue liste" }));
    expect(onChange).toHaveBeenCalledWith("list");
  });

  it("rend les actions comme boutons et déclenche leur callback", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const actions: CanopToolbarAction[] = [{ id: "upload", label: "Importer", onClick }];
    renderToolbar(<Toolbar actions={actions} />);
    await user.click(screen.getByRole("button", { name: "Importer" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("désactive une action marquée disabled", () => {
    const actions: CanopToolbarAction[] = [
      { id: "delete", label: "Supprimer", onClick: () => undefined, disabled: true },
    ];
    renderToolbar(<Toolbar actions={actions} />);
    expect(screen.getByRole("button", { name: "Supprimer" })).toBeDisabled();
  });

  it("bascule les actions non épinglées dans un menu de dépassement en vue compacte", async () => {
    stubCompactViewport();
    const user = userEvent.setup();
    const onClick = vi.fn();
    const actions: CanopToolbarAction[] = [
      { id: "upload", label: "Importer", icon: "upload", onClick: () => undefined, pinned: true },
      { id: "delete", label: "Supprimer", icon: "trash", onClick },
    ];
    renderToolbar(<Toolbar actions={actions} />);

    expect(screen.getByRole("button", { name: "Importer" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Plus d'actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Supprimer" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  describe("pastille de la bascule d'affichage", () => {
    function pillIn(radio: HTMLElement) {
      return radio.querySelector("span[aria-hidden]") as HTMLElement | null;
    }

    it("affiche la pastille ombrée sous l'option d'affichage active uniquement", () => {
      renderToolbar(<Toolbar view={{ value: "list", onChange: () => undefined }} />);
      const pill = pillIn(screen.getByRole("radio", { name: "Vue liste" })) as HTMLElement;
      const wrapper = pill.parentElement as HTMLElement;
      expect(wrapper.style.filter).toBe("var(--canop-drop-shadow-e1) var(--canop-drop-shadow-e1)");
      expect(wrapper.style.clipPath).toBe("");
      expect(wrapper.style.pointerEvents).toBe("none");
      expect(pill.style.clipPath.startsWith("polygon(")).toBe(true);
      expect(pill.style.filter).toBe("");
      expect(pillIn(screen.getByRole("radio", { name: "Vue grille" }))).toBeNull();
    });

    it("bascule l'affichage au clic sur l'option portant la pastille d'une autre vue", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderToolbar(<Toolbar view={{ value: "list", onChange }} />);
      await user.click(screen.getByRole("radio", { name: "Vue grille" }));
      expect(onChange).toHaveBeenCalledWith("grid");
    });
  });
});
