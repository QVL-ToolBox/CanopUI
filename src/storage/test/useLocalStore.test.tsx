import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createLocalStore } from "../createLocalStore";
import { clearPersistentStores, useLocalStore, usePersistentState } from "../useLocalStore";

beforeEach(() => {
  window.localStorage.clear();
  clearPersistentStores();
});

afterEach(() => {
  clearPersistentStores();
});

describe("useLocalStore", () => {
  it("sert la valeur du magasin, puis la suit", () => {
    const store = createLocalStore({ key: "score", initial: 0 });
    const { result } = renderHook(() => useLocalStore(store));

    expect(result.current[0]).toBe(0);

    act(() => result.current[1](12));
    expect(result.current[0]).toBe(12);
  });

  it("donne la même valeur à deux composants qui lisent le même magasin", async () => {
    const store = createLocalStore({ key: "score", initial: 0 });

    function Compteur({ nom }: { nom: string }) {
      const [score, setScore] = useLocalStore(store);
      return (
        <button onClick={() => setScore((current) => current + 1)}>
          {nom} : {score}
        </button>
      );
    }

    render(
      <>
        <Compteur nom="hud" />
        <Compteur nom="recap" />
      </>,
    );

    await userEvent.click(screen.getByRole("button", { name: /hud/ }));

    expect(screen.getByRole("button", { name: "hud : 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "recap : 1" })).toBeInTheDocument();
  });

  it("se remonte sur un écrit venu d'un autre onglet", () => {
    const store = createLocalStore({ key: "score", initial: 0 });
    const { result } = renderHook(() => useLocalStore(store));

    act(() => {
      window.localStorage.setItem("score", JSON.stringify({ v: 1, d: 42 }));
      window.dispatchEvent(
        new StorageEvent("storage", { key: "score", storageArea: window.localStorage }),
      );
    });

    expect(result.current[0]).toBe(42);
  });
});

describe("usePersistentState", () => {
  it("retient la valeur d'un montage à l'autre", () => {
    const premier = renderHook(() => usePersistentState("volume", 1));
    act(() => premier.result.current[1](0.4));
    premier.unmount();
    clearPersistentStores();

    const second = renderHook(() => usePersistentState("volume", 1));
    expect(second.result.current[0]).toBe(0.4);
  });

  it("partage un seul magasin par clé", () => {
    const gauche = renderHook(() => usePersistentState("theme", "clair"));
    const droite = renderHook(() => usePersistentState("theme", "clair"));

    act(() => gauche.result.current[1]("sombre"));

    expect(droite.result.current[0]).toBe("sombre");
  });

  it("ne relance pas le magasin à chaque rendu", () => {
    const { result, rerender } = renderHook(() => usePersistentState("essais", 0));

    act(() => result.current[1](3));
    rerender();
    rerender();

    expect(result.current[0]).toBe(3);
  });
});
