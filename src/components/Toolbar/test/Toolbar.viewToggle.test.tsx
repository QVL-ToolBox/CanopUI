import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopThemeProvider } from "../../../theme";
import { CanopI18nProvider } from "../../../i18n";
import { Icon } from "../../Icon";
import type { CanopIconName } from "../../Icon";
import { Toolbar } from "../Toolbar";
import type { CanopToolbarView } from "../toolbarTypes";

function renderToolbarView(value: CanopToolbarView, onChange = vi.fn()) {
  render(
    <CanopThemeProvider>
      <Toolbar view={{ value, onChange }} />
    </CanopThemeProvider>,
  );
  return onChange;
}

function StatefulViewToolbar({
  initial,
  onChange,
}: {
  initial: CanopToolbarView;
  onChange: (view: CanopToolbarView) => void;
}) {
  const [view, setView] = useState(initial);
  return (
    <Toolbar
      view={{
        value: view,
        onChange: (next) => {
          onChange(next);
          setView(next);
        },
      }}
    />
  );
}

function renderStatefulToolbar(initial: CanopToolbarView) {
  const onChange = vi.fn();
  render(
    <CanopThemeProvider>
      <StatefulViewToolbar initial={initial} onChange={onChange} />
    </CanopThemeProvider>,
  );
  return { user: userEvent.setup(), onChange };
}

function iconPaths(root: Element) {
  return Array.from(root.querySelectorAll("svg path")).map((path) => path.getAttribute("d"));
}

function referenceIconPaths(name: CanopIconName, variant: "solid" | "outline") {
  const { container, unmount } = render(<Icon name={name} variant={variant} />);
  const paths = iconPaths(container);
  unmount();
  return paths;
}

function gridRadio() {
  return screen.getByRole("radio", { name: "Vue grille" });
}

function listRadio() {
  return screen.getByRole("radio", { name: "Vue liste" });
}

function expectActiveView(view: CanopToolbarView) {
  const [active, inactive] =
    view === "grid" ? [gridRadio(), listRadio()] : [listRadio(), gridRadio()];
  expect(active).toHaveAttribute("aria-checked", "true");
  expect(inactive).toHaveAttribute("aria-checked", "false");
  expect(active).toHaveFocus();
}

describe("Toolbar bascule de vue", () => {
  describe("structure", () => {
    it("expose un radiogroup Affichage contenant Vue grille et Vue liste", () => {
      renderToolbarView("grid");
      const group = screen.getByRole("radiogroup", { name: "Affichage" });
      expect(group).toContainElement(gridRadio());
      expect(group).toContainElement(listRadio());
      expect(screen.getAllByRole("radio")).toHaveLength(2);
    });

    it("traduit le nom du radiogroup et des options selon la locale", () => {
      render(
        <CanopI18nProvider locale="en" storageKey={null}>
          <CanopThemeProvider>
            <Toolbar view={{ value: "grid", onChange: () => undefined }} />
          </CanopThemeProvider>
        </CanopI18nProvider>,
      );
      expect(screen.getByRole("radiogroup", { name: "View" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Grid view" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "List view" })).toBeInTheDocument();
    });

    it("n'affiche pas de libellé texte visible dans les options de vue", () => {
      renderToolbarView("grid");
      expect(gridRadio().textContent).toBe("");
      expect(listRadio().textContent).toBe("");
    });

    it("utilise l'icône apps pour la grille et menu pour la liste", () => {
      renderToolbarView("grid");
      expect(iconPaths(gridRadio())).toEqual(referenceIconPaths("apps", "solid"));
      expect(iconPaths(listRadio())).toEqual(referenceIconPaths("menu", "outline"));
    });

    it("passe l'icône de la liste en pleine quand la liste est la vue courante", () => {
      renderToolbarView("list");
      expect(iconPaths(listRadio())).toEqual(referenceIconPaths("menu", "solid"));
      expect(iconPaths(gridRadio())).toEqual(referenceIconPaths("apps", "outline"));
    });

    it.each(["grid", "list"] as const)("coche la vue courante %s", (view) => {
      renderToolbarView(view);
      const [active, inactive] =
        view === "grid" ? [gridRadio(), listRadio()] : [listRadio(), gridRadio()];
      expect(active).toHaveAttribute("aria-checked", "true");
      expect(inactive).toHaveAttribute("aria-checked", "false");
    });
  });

  describe("souris", () => {
    it("émet onChange avec grid au clic sur Vue grille depuis la liste", async () => {
      const user = userEvent.setup();
      const onChange = renderToolbarView("list");
      await user.click(gridRadio());
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith("grid");
    });

    it("émet onChange avec list au clic sur Vue liste depuis la grille", async () => {
      const user = userEvent.setup();
      const onChange = renderToolbarView("grid");
      await user.click(listRadio());
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith("list");
    });

    it.each(["grid", "list"] as const)(
      "n'émet pas onChange au clic sur la vue active %s",
      async (view) => {
        const user = userEvent.setup();
        const onChange = renderToolbarView(view);
        await user.click(view === "grid" ? gridRadio() : listRadio());
        expect(onChange).not.toHaveBeenCalled();
      },
    );
  });

  describe("clavier", () => {
    it.each(["grid", "list"] as const)(
      "ne rend tabulable que l'option active quand la vue est %s",
      (view) => {
        renderToolbarView(view);
        const [active, inactive] =
          view === "grid" ? [gridRadio(), listRadio()] : [listRadio(), gridRadio()];
        expect(active).toHaveAttribute("tabindex", "0");
        expect(inactive).toHaveAttribute("tabindex", "-1");
      },
    );

    it("place le focus sur l'option active à la tabulation", async () => {
      const { user } = renderStatefulToolbar("list");
      await user.tab();
      expect(listRadio()).toHaveFocus();
    });

    it.each([
      ["ArrowRight", "grid", "list"],
      ["ArrowLeft", "list", "grid"],
      ["ArrowDown", "grid", "list"],
      ["ArrowUp", "list", "grid"],
      ["End", "grid", "list"],
      ["Home", "list", "grid"],
    ] as const)("%s depuis %s bascule vers %s et y déplace le focus", async (key, from, to) => {
      const { user, onChange } = renderStatefulToolbar(from);
      await user.tab();
      await user.keyboard(`{${key}}`);
      expect(onChange).toHaveBeenCalledWith(to);
      expectActiveView(to);
    });

    it("met à jour la tabulation après un changement de vue au clavier", async () => {
      const { user } = renderStatefulToolbar("grid");
      await user.tab();
      await user.keyboard("{ArrowRight}");
      expect(listRadio()).toHaveAttribute("tabindex", "0");
      expect(gridRadio()).toHaveAttribute("tabindex", "-1");
    });

    it("enchaîne plusieurs flèches en suivant la vue et le focus", async () => {
      const { user, onChange } = renderStatefulToolbar("grid");
      await user.tab();
      await user.keyboard("{ArrowRight}{ArrowLeft}");
      expect(onChange.mock.calls).toEqual([["list"], ["grid"]]);
      expectActiveView("grid");
    });
  });
});
