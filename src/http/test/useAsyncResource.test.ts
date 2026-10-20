import { describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAsyncResource } from "../useAsyncResource";

describe("useAsyncResource", () => {
  it("sert la valeur initiale, puis la ressource chargee", async () => {
    const { result } = renderHook(() =>
      useAsyncResource({ load: () => Promise.resolve([1, 2, 3]), initial: [] as number[] }),
    );

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual([1, 2, 3]);
    expect(result.current.failed).toBe(false);
  });

  it("signale l'echec sans vider ce qui est affiche", async () => {
    let doitEchouer = false;
    const { result } = renderHook(() =>
      useAsyncResource({
        load: () => (doitEchouer ? Promise.reject(new Error("panne")) : Promise.resolve(["a"])),
        initial: [] as string[],
        toMessage: () => "Chargement impossible",
      }),
    );

    await waitFor(() => expect(result.current.data).toEqual(["a"]));

    doitEchouer = true;
    act(() => result.current.reload());

    await waitFor(() => expect(result.current.failed).toBe(true));
    expect(result.current.error).toBe("Chargement impossible");
    expect(result.current.data).toEqual(["a"]);
  });

  it("laisse l'erreur sans message quand aucune traduction n'est fournie", async () => {
    const { result } = renderHook(() =>
      useAsyncResource({ load: () => Promise.reject(new Error("panne")), initial: null }),
    );

    await waitFor(() => expect(result.current.failed).toBe(true));
    expect(result.current.error).toBeNull();
  });

  it("abandonne vraiment la requete precedente au rechargement", async () => {
    const signaux: AbortSignal[] = [];
    const { result } = renderHook(() =>
      useAsyncResource({
        load: (signal) => {
          signaux.push(signal);
          return new Promise<string>((resolve) => setTimeout(() => resolve("fini"), 50));
        },
        initial: "",
      }),
    );

    act(() => result.current.reload());

    await waitFor(() => expect(signaux.length).toBe(2));
    expect(signaux[0].aborted).toBe(true);
    expect(signaux[1].aborted).toBe(false);
  });

  it("abandonne aussi au demontage", async () => {
    const signaux: AbortSignal[] = [];
    const { unmount } = renderHook(() =>
      useAsyncResource({
        load: (signal) => {
          signaux.push(signal);
          return new Promise<string>(() => undefined);
        },
        initial: "",
      }),
    );

    unmount();

    expect(signaux[0].aborted).toBe(true);
  });

  it("ne charge rien tant qu'il est desactive", async () => {
    const load = vi.fn(() => Promise.resolve("x"));
    const { result } = renderHook(() => useAsyncResource({ load, initial: "", enabled: false }));

    expect(load).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);

    act(() => result.current.reload());
    expect(load).not.toHaveBeenCalled();
  });

  it("ne relance pas la requete quand le parent se rend a nouveau", async () => {
    const load = vi.fn(() => Promise.resolve("x"));
    const { result, rerender } = renderHook(() => useAsyncResource({ load, initial: "" }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    rerender();
    rerender();

    expect(load).toHaveBeenCalledTimes(1);
  });
});
