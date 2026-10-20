import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CanopSoundProvider } from "../CanopSoundProvider";
import { useCanopSound } from "../CanopSoundContext";
import { installFakeAudio, type FakeAudio } from "./fakeAudio";

let audio: FakeAudio | null = null;

beforeEach(() => {
  window.localStorage.clear();
  audio = installFakeAudio();
});

afterEach(() => {
  audio?.restore();
  audio = null;
});

function poser(ui: React.ReactNode, props: Record<string, unknown> = {}) {
  return render(<CanopSoundProvider {...props}>{ui}</CanopSoundProvider>);
}

function Bouton({ nom }: { nom: string }) {
  const { muted, toggleMuted } = useCanopSound();
  return (
    <button onClick={toggleMuted}>
      {nom} : {muted ? "coupé" : "actif"}
    </button>
  );
}

describe("CanopSoundProvider — l'état partagé", () => {
  it("donne la même vérité à deux consommateurs éloignés", async () => {
    poser(
      <>
        <Bouton nom="entête" />
        <Bouton nom="pied" />
      </>,
    );

    await userEvent.click(screen.getByRole("button", { name: /entête/ }));

    expect(screen.getByRole("button", { name: /entête : coupé/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pied : coupé/ })).toBeInTheDocument();
  });

  it("part actif, et coupé si on le demande", () => {
    const { result } = renderHook(() => useCanopSound(), {
      wrapper: ({ children }) => <CanopSoundProvider>{children}</CanopSoundProvider>,
    });
    expect(result.current.muted).toBe(false);

    const coupe = renderHook(() => useCanopSound(), {
      wrapper: ({ children }) => <CanopSoundProvider defaultMuted>{children}</CanopSoundProvider>,
    });
    expect(coupe.result.current.muted).toBe(true);
  });

  it("refuse de fonctionner hors de son provider", () => {
    const silence = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(() => renderHook(() => useCanopSound())).toThrow(/CanopSoundProvider/);
    silence.mockRestore();
  });
});

describe("CanopSoundProvider — la persistance", () => {
  function monter(props: Record<string, unknown> = {}) {
    return renderHook(() => useCanopSound(), {
      wrapper: ({ children }) => <CanopSoundProvider {...props}>{children}</CanopSoundProvider>,
    });
  }

  it("retient la coupure et le volume", () => {
    const { result } = monter();

    act(() => result.current.setMuted(true));
    act(() => result.current.setVolume(0.4));

    expect(JSON.parse(window.localStorage.getItem("canop-sound") ?? "{}")).toEqual({
      muted: true,
      volume: 0.4,
    });
  });

  it("relit le réglage au montage suivant", () => {
    window.localStorage.setItem("canop-sound", JSON.stringify({ muted: true, volume: 0.3 }));
    const { result } = monter();

    expect(result.current.muted).toBe(true);
    expect(result.current.volume).toBe(0.3);
  });

  it("ignore un réglage illisible au lieu de casser l'écran", () => {
    window.localStorage.setItem("canop-sound", "{ceci n'est pas du json");
    const { result } = monter({ defaultVolume: 0.9 });

    expect(result.current.muted).toBe(false);
    expect(result.current.volume).toBe(0.9);
  });

  it("ignore un volume hors bornes venu du stockage", () => {
    window.localStorage.setItem("canop-sound", JSON.stringify({ muted: false, volume: 12 }));
    const { result } = monter();

    expect(result.current.volume).toBe(1);
  });

  it("ne retient rien quand la clé est nulle", () => {
    const { result } = monter({ storageKey: null });

    act(() => result.current.setMuted(true));

    expect(window.localStorage.length).toBe(0);
    expect(result.current.muted).toBe(true);
  });

  it("écrit sous la clé demandée", () => {
    const { result } = monter({ storageKey: "departemental:son" });

    act(() => result.current.setMuted(true));

    expect(window.localStorage.getItem("departemental:son")).toContain('"muted":true');
    expect(window.localStorage.getItem("canop-sound")).toBeNull();
  });

  it("borne le volume qu'on lui donne", () => {
    const { result } = monter();

    act(() => result.current.setVolume(3));
    expect(result.current.volume).toBe(1);

    act(() => result.current.setVolume(-2));
    expect(result.current.volume).toBe(0);
  });
});

describe("CanopSoundProvider — le moteur", () => {
  function monter(props: Record<string, unknown> = {}) {
    return renderHook(() => useCanopSound(), {
      wrapper: ({ children }) => <CanopSoundProvider {...props}>{children}</CanopSoundProvider>,
    });
  }

  it("ne joue rien tant que le son est coupé", () => {
    const { result } = monter({ defaultMuted: true });

    expect(result.current.play("correct")).toBe("muted");
    expect(audio?.notes).toHaveLength(0);
  });

  it("confirme à l'oreille le geste qui rallume le son", () => {
    const { result } = monter({ defaultMuted: true });

    act(() => result.current.toggleMuted());

    expect(result.current.muted).toBe(false);
    expect(audio?.notes.length).toBeGreaterThan(0);
  });

  it("reste silencieux quand on coupe le son", () => {
    const { result } = monter();

    act(() => result.current.toggleMuted());

    expect(result.current.muted).toBe(true);
    expect(audio?.notes).toHaveLength(0);
  });

  it("porte le volume courant sur ce qu'il joue", () => {
    const { result } = monter();

    act(() => result.current.setVolume(0.5));
    result.current.play("click");

    expect(audio?.notes[0].peak).toBeCloseTo(0.07 * 0.5, 5);
  });

  it("ferme le contexte audio au démontage", () => {
    const { result, unmount } = monter();

    result.current.play("click");
    unmount();

    expect(audio?.closed).toBe(1);
  });

  it("ne recrée pas le moteur à chaque rendu du parent", () => {
    const { result, rerender } = monter();

    result.current.play("click");
    rerender();
    rerender();
    result.current.play("click");

    expect(audio?.created).toBe(1);
  });
});
