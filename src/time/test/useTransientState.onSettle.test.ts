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

function poser(onSettle: () => void, duration = 500) {
  return renderHook(() => useTransientState<string | null>(null, { duration, onSettle }));
}

describe("useTransientState — onSettle", () => {
  it("prévient quand la valeur est revenue d'elle-même au repos", () => {
    const onSettle = vi.fn();
    const { result } = poser(onSettle);

    act(() => result.current.show("juste"));
    avancer(499);
    expect(onSettle).not.toHaveBeenCalled();

    avancer(1);
    expect(onSettle).toHaveBeenCalledOnce();
    expect(result.current.value).toBeNull();
  });

  it("suit la durée donnée à l'appel", () => {
    const onSettle = vi.fn();
    const { result } = poser(onSettle);

    act(() => result.current.show("juste", 200));
    avancer(200);

    expect(onSettle).toHaveBeenCalledOnce();
  });

  it("ne prévient pas sur un retour au repos demandé", () => {
    const onSettle = vi.fn();
    const { result } = poser(onSettle);

    act(() => result.current.show("juste"));
    act(() => result.current.clear());
    avancer(1_000);

    expect(onSettle).not.toHaveBeenCalled();
  });

  it("ne prévient pas après démontage", () => {
    const onSettle = vi.fn();
    const { result, unmount } = poser(onSettle);

    act(() => result.current.show("juste"));
    unmount();
    avancer(1_000);

    expect(onSettle).not.toHaveBeenCalled();
  });

  it("ne prévient qu'une fois quand deux affichages se chevauchent", () => {
    const onSettle = vi.fn();
    const { result } = poser(onSettle);

    act(() => result.current.show("premier"));
    avancer(300);
    act(() => result.current.show("second"));
    avancer(500);

    expect(onSettle).toHaveBeenCalledOnce();
  });
});
