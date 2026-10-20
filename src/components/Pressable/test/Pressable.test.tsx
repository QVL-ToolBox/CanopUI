import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { CSSObject } from "@emotion/react";
import { CanopThemeProvider } from "../../../theme";
import { Pressable } from "../Pressable";
import { usePressable, type UsePressableParams } from "../usePressable";

function poser(ui: React.ReactNode) {
  return render(<CanopThemeProvider>{ui}</CanopThemeProvider>);
}

function mockReducedMotion(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reduced && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeEach(() => {
  mockReducedMotion(false);
});

describe("Pressable", () => {
  it("declenche l'action au clic", async () => {
    const onClick = vi.fn();
    poser(<Pressable onClick={onClick} ariaLabel="Choisir le vert" />);

    await userEvent.click(screen.getByRole("button", { name: "Choisir le vert" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("est atteignable et actionnable au clavier", async () => {
    const onClick = vi.fn();
    poser(<Pressable onClick={onClick} ariaLabel="Ouvrir la photo" />);

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Ouvrir la photo" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("expose le role et l'etat coche qu'on lui donne", () => {
    poser(<Pressable role="radio" ariaChecked ariaLabel="Vert" />);

    expect(screen.getByRole("radio", { name: "Vert" })).toBeChecked();
  });

  it("n'appelle rien quand elle est desactivee", () => {
    const onClick = vi.fn();
    poser(<Pressable onClick={onClick} disabled ariaLabel="Indisponible" />);
    const surface = screen.getByRole("button", { name: "Indisponible" });

    expect(surface).toBeDisabled();
    fireEvent.click(surface);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("rend son contenu tel quel", () => {
    poser(
      <Pressable ariaLabel="Tuile">
        <img alt="Vue du lac" src="/lac.jpg" />
      </Pressable>,
    );

    expect(screen.getByAltText("Vue du lac")).toBeInTheDocument();
  });

  it("peint son fond sur l'element et non sur un calque derriere lui", () => {
    poser(<Pressable ariaLabel="Pastille" background="rgb(1, 2, 3)" size="2.25rem" />);
    const surface = screen.getByRole("button", { name: "Pastille" });

    expect(surface).toHaveStyle({ backgroundColor: "rgb(1, 2, 3)" });
    expect(getComputedStyle(surface).clipPath).toContain("polygon(");
  });

  it("suit le squircle, et le disque quand on le demande", () => {
    const { rerender } = poser(<Pressable ariaLabel="Carre" radius="md" />);
    const carre = getComputedStyle(screen.getByRole("button", { name: "Carre" })).clipPath;

    rerender(
      <CanopThemeProvider>
        <Pressable ariaLabel="Carre" radius="circle" />
      </CanopThemeProvider>,
    );
    const disque = getComputedStyle(screen.getByRole("button", { name: "Carre" })).clipPath;

    expect(carre).toContain("polygon(");
    expect(disque).toContain("polygon(");
    expect(disque).not.toBe(carre);
  });

  it("signale la selection par un lisere, jamais par une bordure", () => {
    poser(<Pressable ariaLabel="Selectionne" selected />);
    const surface = screen.getByRole("button", { name: "Selectionne" });
    const style = getComputedStyle(surface);

    expect(style.boxShadow).not.toBe("none");
    expect(style.borderWidth === "" || style.borderWidth === "0px").toBe(true);
  });
});

function rootSx(params: Partial<UsePressableParams> = {}): CSSObject {
  const { result } = renderHook(() =>
    usePressable({
      radius: "md",
      padding: "none",
      selected: false,
      fullWidth: false,
      disabled: false,
      dimWhenDisabled: true,
      ...params,
    }),
  );
  return result.current.rootSx as unknown as CSSObject;
}

describe("Pressable — le retour a l'appui", () => {
  it("s'enfonce sous le doigt", () => {
    expect((rootSx()["&:active"] as CSSObject).transform).toBe("scale(0.97)");
  });

  it("ne retombe pas sous sa taille de repos quand elle est selectionnee", () => {
    expect((rootSx({ selected: true })["&:active"] as CSSObject).transform).toBe("scale(1.01)");
  });

  it("ne s'enfonce pas en mouvement reduit", () => {
    mockReducedMotion(true);
    expect(rootSx()["&:active"]).toBeUndefined();
  });

  it("ne s'enfonce pas quand elle est desactivee", () => {
    expect(rootSx({ disabled: true })["&:active"]).toBeUndefined();
  });
});

describe("Pressable — l'attenuation des surfaces desactivees", () => {
  it("attenue par defaut", () => {
    expect((rootSx()["&.Mui-disabled"] as CSSObject).opacity).toBe(0.5);
  });

  it("cesse d'attenuer quand le verrouillage sert a montrer quelque chose", () => {
    expect(rootSx({ dimWhenDisabled: false })["&.Mui-disabled"]).toBeUndefined();
  });
});
