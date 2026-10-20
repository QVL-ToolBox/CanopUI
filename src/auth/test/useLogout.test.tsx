import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLogout } from "../useLogout";

const assign = vi.fn();

beforeEach(() => {
  assign.mockClear();
  Object.defineProperty(window, "location", {
    writable: true,
    value: { ...window.location, assign, href: "https://portail.qvl/comptes" },
  });
});

describe("useLogout", () => {
  it("invalide la session puis quitte la page", async () => {
    const ordre: string[] = [];
    const logout = vi.fn(async () => {
      ordre.push("logout");
    });
    assign.mockImplementation(() => ordre.push("navigation"));

    const { result } = renderHook(() =>
      useLogout({ logout, loginUrl: () => "https://auth.qvl/login" }),
    );
    await act(() => result.current());

    expect(logout).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith("https://auth.qvl/login");
    expect(ordre).toEqual(["logout", "navigation"]);
  });

  it("quitte la page meme si l'appel echoue", async () => {
    const logout = vi.fn(() => Promise.reject(new Error("serveur muet")));

    const { result } = renderHook(() =>
      useLogout({ logout, loginUrl: () => "https://auth.qvl/login" }),
    );
    await act(() => result.current().catch(() => undefined));

    expect(assign).toHaveBeenCalledWith("https://auth.qvl/login");
  });

  it("garde la meme fonction tant que ses parametres ne changent pas", () => {
    const logout = vi.fn(async () => undefined);
    const loginUrl = () => "https://auth.qvl/login";

    const { result, rerender } = renderHook(() => useLogout({ logout, loginUrl }));
    const premiere = result.current;
    rerender();

    expect(result.current).toBe(premiere);
  });
});
