import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act, renderHook } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { Menu } from "../Menu";
import { useMenuAnchor } from "../useMenuAnchor";

function poser(ui: React.ReactNode) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

describe("Menu — la liste d'entrees", () => {
  it("rend une entree par element decrit", () => {
    poser(
      <Menu
        open
        onClose={vi.fn()}
        ariaLabel="Actions"
        items={[
          { label: "Renommer", icon: "pencil" },
          { label: "Telecharger", icon: "download" },
          { label: "Supprimer", icon: "trash", danger: true },
        ]}
      />,
    );

    expect(screen.getByRole("menu", { name: "Actions" })).toBeInTheDocument();
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });

  it("ferme le menu avant d'executer l'action", async () => {
    const ordre: string[] = [];
    const onClose = vi.fn(() => ordre.push("fermeture"));
    const onClick = vi.fn(() => ordre.push("action"));

    poser(<Menu open onClose={onClose} items={[{ label: "Supprimer", onClick }]} />);
    await userEvent.click(screen.getByRole("menuitem", { name: "Supprimer" }));

    expect(ordre).toEqual(["fermeture", "action"]);
  });

  it("respecte une entree desactivee", async () => {
    const onClick = vi.fn();
    poser(<Menu open onClose={vi.fn()} items={[{ label: "Deplacer", onClick, disabled: true }]} />);

    expect(screen.getByRole("menuitem", { name: "Deplacer" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(onClick).not.toHaveBeenCalled();
  });

  it("accepte encore des enfants composes, pour un menu qui n'est pas qu'une liste", () => {
    poser(
      <Menu open onClose={vi.fn()}>
        <p>Un en-tete</p>
      </Menu>,
    );

    expect(screen.getByText("Un en-tete")).toBeInTheDocument();
  });
});

describe("useMenuAnchor", () => {
  it("part ferme et sans ancre", () => {
    const { result } = renderHook(() => useMenuAnchor());

    expect(result.current.open).toBe(false);
    expect(result.current.anchorEl).toBeNull();
  });

  it("ouvre, puis ferme", () => {
    const { result } = renderHook(() => useMenuAnchor());

    act(() => result.current.openMenu());
    expect(result.current.open).toBe(true);

    act(() => result.current.closeMenu());
    expect(result.current.open).toBe(false);
  });

  it("ferme avant d'agir, dans cet ordre", () => {
    const ordre: string[] = [];
    const { result } = renderHook(() => useMenuAnchor());
    act(() => result.current.openMenu());

    const action = result.current.withClose(() => ordre.push("action"));
    act(() => action());

    expect(result.current.open).toBe(false);
    expect(ordre).toEqual(["action"]);
  });

  it("passe les arguments de l'action a travers", () => {
    const recu: string[] = [];
    const { result } = renderHook(() => useMenuAnchor());

    const action = result.current.withClose((id: string) => recu.push(id));
    act(() => action("categorie-7"));

    expect(recu).toEqual(["categorie-7"]);
  });
});
