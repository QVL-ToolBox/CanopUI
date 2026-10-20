import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useCopyToClipboard } from "../useCopyToClipboard";

function poserPressePapier(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
}

function retirerPressePapier() {
  Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
}

afterEach(() => {
  retirerPressePapier();
  vi.restoreAllMocks();
});

describe("useCopyToClipboard", () => {
  it("copie le texte donné au hook", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    poserPressePapier(writeText);
    const { result } = renderHook(() => useCopyToClipboard("DéparteMental 3/6"));

    act(() => result.current.copy());

    await waitFor(() => expect(result.current.copied).toBe(true));
    expect(writeText).toHaveBeenCalledWith("DéparteMental 3/6");
  });

  it("préfère le texte donné à l'appel", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    poserPressePapier(writeText);
    const { result } = renderHook(() => useCopyToClipboard("au montage"));

    act(() => result.current.copy("au clic"));

    await waitFor(() => expect(result.current.copied).toBe(true));
    expect(writeText).toHaveBeenCalledWith("au clic");
  });

  it("retire la confirmation d'elle-même", async () => {
    poserPressePapier(() => Promise.resolve());
    const { result } = renderHook(() => useCopyToClipboard("x", { duration: 400 }));

    act(() => result.current.copy());
    await waitFor(() => expect(result.current.copied).toBe(true));

    await waitFor(() => expect(result.current.copied).toBe(false));
    expect(result.current.outcome).toBe("idle");
  });

  it("signale l'échec quand le presse-papier refuse", async () => {
    poserPressePapier(() => Promise.reject(new Error("refusé")));
    const { result } = renderHook(() => useCopyToClipboard("x"));

    act(() => result.current.copy());

    await waitFor(() => expect(result.current.failed).toBe(true));
    expect(result.current.copied).toBe(false);
  });

  it("signale l'échec quand l'API n'existe pas", () => {
    retirerPressePapier();
    const { result } = renderHook(() => useCopyToClipboard("x"));

    act(() => result.current.copy());

    expect(result.current.failed).toBe(true);
    expect(result.current.outcome).toBe("failed");
  });

  it("copie une chaîne vide plutôt que « undefined »", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    poserPressePapier(writeText);
    const { result } = renderHook(() => useCopyToClipboard());

    act(() => result.current.copy());

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(""));
  });
});
