import { beforeEach, describe, expect, it, vi } from "vitest";
import { createLocalStore } from "../createLocalStore";

interface Progression {
  vues: number;
  reussies: number;
}

const initial: Progression = { vues: 0, reussies: 0 };

beforeEach(() => {
  window.localStorage.clear();
});

describe("createLocalStore — lire et écrire", () => {
  it("part de l'initial quand rien n'est stocké", () => {
    const store = createLocalStore({ key: "jeu", initial });
    expect(store.get()).toEqual(initial);
  });

  it("retient ce qu'on lui donne, et le relit au montage suivant", () => {
    createLocalStore({ key: "jeu", initial }).set({ vues: 3, reussies: 2 });

    expect(createLocalStore({ key: "jeu", initial }).get()).toEqual({ vues: 3, reussies: 2 });
  });

  it("accepte une fonction de mise à jour", () => {
    const store = createLocalStore({ key: "jeu", initial });

    store.set((current) => ({ ...current, vues: current.vues + 1 }));
    store.set((current) => ({ ...current, vues: current.vues + 1 }));

    expect(store.get().vues).toBe(2);
  });

  it("ne relit jamais le stockage pour servir l'état", () => {
    const store = createLocalStore({ key: "jeu", initial });
    const getItem = vi.spyOn(window.localStorage, "getItem");

    for (let index = 0; index < 101; index += 1) store.get();

    expect(getItem).not.toHaveBeenCalled();
    getItem.mockRestore();
  });

  it("revient à l'initial et efface la sauvegarde", () => {
    const store = createLocalStore({ key: "jeu", initial });
    store.set({ vues: 9, reussies: 9 });

    store.reset();

    expect(store.get()).toEqual(initial);
    expect(window.localStorage.getItem("jeu")).toBeNull();
  });

  it("n'écrit rien et ne prévient personne pour une valeur identique", () => {
    const store = createLocalStore({ key: "jeu", initial });
    const meme = { vues: 1, reussies: 1 };
    store.set(meme);
    const temoin = vi.fn();
    store.subscribe(temoin);

    store.set(meme);

    expect(temoin).not.toHaveBeenCalled();
  });

  it("ne persiste rien quand le support est nul", () => {
    const store = createLocalStore({ key: "jeu", initial, storage: null });

    store.set({ vues: 5, reussies: 5 });

    expect(store.get().vues).toBe(5);
    expect(window.localStorage.length).toBe(0);
  });

  it("survit à une sauvegarde illisible", () => {
    window.localStorage.setItem("jeu", "{ceci n'est pas du json");
    expect(createLocalStore({ key: "jeu", initial }).get()).toEqual(initial);
  });
});

describe("createLocalStore — les versions", () => {
  it("reprend une sauvegarde de version antérieure par la migration", () => {
    createLocalStore({ key: "jeu", version: 1, initial }).set({ vues: 4, reussies: 3 });

    const store = createLocalStore({
      key: "jeu",
      version: 2,
      initial,
      migrate: (stored, version) => {
        expect(version).toBe(1);
        const ancien = stored as Progression;
        return { vues: ancien.vues, reussies: ancien.reussies };
      },
    });

    expect(store.get()).toEqual({ vues: 4, reussies: 3 });
  });

  it("traite une sauvegarde sans numéro comme la version 0", () => {
    window.localStorage.setItem("jeu", JSON.stringify({ vues: 7, reussies: 1 }));

    const store = createLocalStore({
      key: "jeu",
      version: 1,
      initial,
      migrate: (stored, version) => {
        expect(version).toBe(0);
        return stored as Progression;
      },
    });

    expect(store.get()).toEqual({ vues: 7, reussies: 1 });
  });

  it("repart de zéro quand la version change sans migration fournie", () => {
    createLocalStore({ key: "jeu", version: 1, initial }).set({ vues: 4, reussies: 3 });

    expect(createLocalStore({ key: "jeu", version: 2, initial }).get()).toEqual(initial);
  });

  it("repart de zéro quand la migration renonce", () => {
    createLocalStore({ key: "jeu", version: 1, initial }).set({ vues: 4, reussies: 3 });

    const store = createLocalStore({ key: "jeu", version: 2, initial, migrate: () => null });

    expect(store.get()).toEqual(initial);
  });

  it("repart de zéro quand la migration lève", () => {
    createLocalStore({ key: "jeu", version: 1, initial }).set({ vues: 4, reussies: 3 });

    const store = createLocalStore({
      key: "jeu",
      version: 2,
      initial,
      migrate: () => {
        throw new Error("forme inattendue");
      },
    });

    expect(store.get()).toEqual(initial);
  });
});

describe("createLocalStore — les abonnés", () => {
  it("prévient à chaque changement", () => {
    const store = createLocalStore({ key: "jeu", initial });
    const temoin = vi.fn();
    store.subscribe(temoin);

    store.set({ vues: 1, reussies: 0 });
    store.set({ vues: 2, reussies: 0 });

    expect(temoin).toHaveBeenCalledTimes(2);
  });

  it("se désabonne", () => {
    const store = createLocalStore({ key: "jeu", initial });
    const temoin = vi.fn();
    store.subscribe(temoin)();

    store.set({ vues: 1, reussies: 0 });

    expect(temoin).not.toHaveBeenCalled();
  });

  it("suit un écrit venu d'un autre onglet", () => {
    const store = createLocalStore({ key: "jeu", initial });
    const temoin = vi.fn();
    store.subscribe(temoin);

    window.localStorage.setItem("jeu", JSON.stringify({ v: 1, d: { vues: 8, reussies: 8 } }));
    window.dispatchEvent(
      new StorageEvent("storage", { key: "jeu", storageArea: window.localStorage }),
    );

    expect(store.get()).toEqual({ vues: 8, reussies: 8 });
    expect(temoin).toHaveBeenCalledTimes(1);
  });

  it("ignore un écrit portant sur une autre clé", () => {
    const store = createLocalStore({ key: "jeu", initial });
    const temoin = vi.fn();
    store.subscribe(temoin);

    window.dispatchEvent(
      new StorageEvent("storage", { key: "autre-chose", storageArea: window.localStorage }),
    );

    expect(temoin).not.toHaveBeenCalled();
  });

  it("se détache quand on le jette", () => {
    const store = createLocalStore({ key: "jeu", initial });
    const temoin = vi.fn();
    store.subscribe(temoin);

    store.dispose();
    window.dispatchEvent(
      new StorageEvent("storage", { key: "jeu", storageArea: window.localStorage }),
    );

    expect(temoin).not.toHaveBeenCalled();
  });
});
