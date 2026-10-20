import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCountdown } from "../useCountdown";

const MINUTE = 60_000;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-07T10:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

function avancer(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("useCountdown", () => {
  it("part de la durée pleine, à l'arrêt", () => {
    const { result } = renderHook(() => useCountdown({ duration: MINUTE }));

    expect(result.current.remaining).toBe(MINUTE);
    expect(result.current.seconds).toBe(60);
    expect(result.current.ended).toBe(false);
  });

  it("ne bouge pas tant qu'il ne court pas", () => {
    const { result } = renderHook(() => useCountdown({ duration: MINUTE }));

    avancer(5_000);

    expect(result.current.remaining).toBe(MINUTE);
  });

  it("décompte quand il court", () => {
    const { result } = renderHook(() => useCountdown({ duration: MINUTE, running: true }));

    avancer(1_000);
    expect(result.current.remaining).toBe(59_000);

    avancer(9_000);
    expect(result.current.remaining).toBe(50_000);
  });

  it("affiche chaque seconde une seconde entière", () => {
    const { result } = renderHook(() => useCountdown({ duration: MINUTE, running: true }));

    avancer(999);
    expect(result.current.seconds).toBe(60);

    avancer(1);
    expect(result.current.seconds).toBe(59);
  });

  it("s'arrête à zéro sans passer dans le négatif", () => {
    const { result } = renderHook(() => useCountdown({ duration: 2_000, running: true }));

    avancer(10_000);

    expect(result.current.remaining).toBe(0);
    expect(result.current.seconds).toBe(0);
    expect(result.current.ended).toBe(true);
  });

  it("annonce la fin une seule fois", () => {
    const onEnd = vi.fn();
    renderHook(() => useCountdown({ duration: 1_000, running: true, onEnd }));

    avancer(5_000);

    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("ne se relance pas parce que le parent se rend à nouveau", () => {
    const { result, rerender } = renderHook(
      ({ duration }) => useCountdown({ duration, running: true, onEnd: () => undefined }),
      { initialProps: { duration: MINUTE } },
    );

    avancer(5_000);
    rerender({ duration: MINUTE });
    rerender({ duration: MINUTE });
    avancer(5_000);

    expect(result.current.remaining).toBe(50_000);
  });
});

describe("useCountdown — la dérive", () => {
  it("suit l'horloge, et non le nombre de ticks", () => {
    const { result } = renderHook(() => useCountdown({ duration: MINUTE, running: true }));

    act(() => {
      vi.setSystemTime(Date.now() + 30_000);
      vi.advanceTimersByTime(100);
    });

    expect(result.current.remaining).toBe(29_900);
  });

  it("n'accumule aucun retard sur toute la durée", () => {
    const { result } = renderHook(() =>
      useCountdown({ duration: MINUTE, running: true, interval: 250 }),
    );

    for (let seconde = 0; seconde < 60; seconde += 1) avancer(1_000);

    expect(result.current.remaining).toBe(0);
    expect(result.current.elapsed).toBe(MINUTE);
  });

  it("tient la même vérité avec un intervalle grossier", () => {
    const { result } = renderHook(() =>
      useCountdown({ duration: MINUTE, running: true, interval: 1_000 }),
    );

    avancer(7_000);

    expect(result.current.remaining).toBe(53_000);
  });
});

describe("useCountdown — la pause", () => {
  it("gèle le temps restant, et reprend là où il en était", () => {
    const { result, rerender } = renderHook(
      ({ running }) => useCountdown({ duration: MINUTE, running }),
      {
        initialProps: { running: true },
      },
    );

    avancer(10_000);
    rerender({ running: false });
    avancer(30_000);

    expect(result.current.remaining).toBe(50_000);

    rerender({ running: true });
    avancer(5_000);

    expect(result.current.remaining).toBe(45_000);
  });

  it("gèle à l'instant exact, pas au dernier tick", () => {
    const { result, rerender } = renderHook(
      ({ running }) => useCountdown({ duration: MINUTE, running }),
      {
        initialProps: { running: true },
      },
    );

    avancer(1_250);
    rerender({ running: false });

    expect(result.current.remaining).toBe(58_750);
  });
});

describe("useCountdown — repartir", () => {
  it("revient à la durée pleine sur demande", () => {
    const { result } = renderHook(() => useCountdown({ duration: MINUTE, running: true }));

    avancer(20_000);
    act(() => result.current.restart());

    expect(result.current.remaining).toBe(MINUTE);

    avancer(3_000);
    expect(result.current.remaining).toBe(57_000);
  });

  it("réarme l'annonce de fin", () => {
    const onEnd = vi.fn();
    const { result } = renderHook(() => useCountdown({ duration: 1_000, running: true, onEnd }));

    avancer(2_000);
    expect(onEnd).toHaveBeenCalledTimes(1);

    act(() => result.current.restart());
    avancer(2_000);

    expect(onEnd).toHaveBeenCalledTimes(2);
  });

  it("repart de la nouvelle durée quand elle change", () => {
    const { result, rerender } = renderHook(
      ({ duration }) => useCountdown({ duration, running: true }),
      { initialProps: { duration: MINUTE } },
    );

    avancer(10_000);
    rerender({ duration: 30_000 });

    expect(result.current.remaining).toBe(30_000);

    avancer(5_000);
    expect(result.current.remaining).toBe(25_000);
  });
});

describe("useCountdown — la progression", () => {
  it("va de 0 à 1", () => {
    const { result } = renderHook(() => useCountdown({ duration: 10_000, running: true }));

    expect(result.current.progress).toBe(0);

    avancer(2_500);
    expect(result.current.progress).toBeCloseTo(0.25, 5);

    avancer(7_500);
    expect(result.current.progress).toBe(1);
  });

  it("se déclare terminé plutôt que de diviser par zéro", () => {
    const { result } = renderHook(() => useCountdown({ duration: 0 }));

    expect(result.current.progress).toBe(1);
    expect(result.current.ended).toBe(true);
  });
});
