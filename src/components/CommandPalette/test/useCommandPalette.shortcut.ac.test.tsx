import { describe, expect, expectTypeOf, it } from "vitest";
import { act, fireEvent, renderHook } from "@testing-library/react";
import type { UseCommandPaletteOptions } from "../../../index";
import { useCommandPalette } from "../../../index";

function pressShortcut(modifier: "ctrlKey" | "metaKey") {
  let notPrevented = true;
  act(() => {
    notPrevented = fireEvent.keyDown(document, { key: "k", [modifier]: true });
  });
  return { prevented: !notPrevented };
}

describe("AC8 useCommandPalette({ shortcut })", () => {
  it("ouvre la palette avec Ctrl+K quand aucune option n'est fournie", () => {
    const { result } = renderHook(() => useCommandPalette());
    expect(pressShortcut("ctrlKey").prevented).toBe(true);
    expect(result.current.open).toBe(true);
  });

  it("ouvre la palette avec Cmd+K quand shortcut vaut true", () => {
    const { result } = renderHook(() => useCommandPalette({ shortcut: true }));
    pressShortcut("metaKey");
    expect(result.current.open).toBe(true);
  });

  it("ouvre la palette avec Ctrl+K quand l'objet d'options est vide", () => {
    const { result } = renderHook(() => useCommandPalette({}));
    pressShortcut("ctrlKey");
    expect(result.current.open).toBe(true);
  });

  it.each(["ctrlKey", "metaKey"] as const)(
    "n'écoute plus le raccourci avec %s quand shortcut vaut false",
    (modifier) => {
      const { result } = renderHook(() => useCommandPalette({ shortcut: false }));
      expect(pressShortcut(modifier).prevented).toBe(false);
      expect(result.current.open).toBe(false);
    },
  );

  it("garde l'ouverture programmatique quand shortcut vaut false", () => {
    const { result } = renderHook(() => useCommandPalette({ shortcut: false }));
    act(() => result.current.setOpen(true));
    expect(result.current.open).toBe(true);
  });

  it("cesse d'écouter le raccourci quand shortcut passe de true à false", () => {
    const { result, rerender } = renderHook(
      ({ shortcut }: UseCommandPaletteOptions) => useCommandPalette({ shortcut }),
      { initialProps: { shortcut: true } },
    );
    rerender({ shortcut: false });
    expect(pressShortcut("ctrlKey").prevented).toBe(false);
    expect(result.current.open).toBe(false);
  });

  it("exporte le type UseCommandPaletteOptions avec un shortcut booléen optionnel", () => {
    expectTypeOf<UseCommandPaletteOptions>().toEqualTypeOf<{ shortcut?: boolean }>();
  });
});
