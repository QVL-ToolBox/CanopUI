import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTransientState } from "../useTransientState";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function avancer(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("useTransientState", () => {
  it("part au repos", () => {
    const { result } = renderHook(() => useTransientState<"ok" | "ko" | null>(null));
    expect(result.current.value).toBeNull();
  });

  it("pose la valeur, puis la retire d'elle-même", () => {
    const { result } = renderHook(() => useTransientState<string | null>(null, { duration: 500 }));

    act(() => result.current.show("copié"));
    expect(result.current.value).toBe("copié");

    avancer(499);
    expect(result.current.value).toBe("copié");

    avancer(1);
    expect(result.current.value).toBeNull();
  });

  it("accepte une durée à l'appel", () => {
    const { result } = renderHook(() => useTransientState<string | null>(null, { duration: 350 }));

    act(() => result.current.show("ko", 1_100));

    avancer(400);
    expect(result.current.value).toBe("ko");

    avancer(700);
    expect(result.current.value).toBeNull();
  });

  it("remplace la minuterie en cours au lieu de l'empiler", () => {
    const { result } = renderHook(() => useTransientState<string | null>(null, { duration: 500 }));

    act(() => result.current.show("premier"));
    avancer(400);
    act(() => result.current.show("second"));

    avancer(200);
    expect(result.current.value).toBe("second");

    avancer(300);
    expect(result.current.value).toBeNull();
  });

  it("revient au repos sur demande", () => {
    const { result } = renderHook(() => useTransientState<string | null>(null, { duration: 500 }));

    act(() => result.current.show("copié"));
    act(() => result.current.clear());

    expect(result.current.value).toBeNull();
  });

  it("n'écrit plus rien après le démontage", () => {
    const { result, unmount } = renderHook(() =>
      useTransientState<string | null>(null, { duration: 500 }),
    );

    act(() => result.current.show("éclair"));
    unmount();

    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    expect(() => vi.advanceTimersByTime(1_000)).not.toThrow();
    clearTimeoutSpy.mockRestore();
    expect(vi.getTimerCount()).toBe(0);
  });
});
