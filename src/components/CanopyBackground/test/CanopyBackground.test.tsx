import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopyBackground } from "../CanopyBackground";
import { MEDIA_WATCH_INTERVAL_MS } from "../useCanopyBackground";
import {
  CANOPY_ASSET_BASE,
  CANOP_CANOPY_SCENES,
  canopyScenesFrom,
  resolveCanopyScene,
} from "../canopyScenes";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function renderCanopy(ui: ReactNode, mode: "light" | "dark" = "light") {
  return render(<CanopThemeProvider defaultMode={mode}>{ui}</CanopThemeProvider>);
}

function video(): HTMLVideoElement | null {
  return document.querySelector("video");
}

describe("CanopyBackground", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("joue la scene en boucle, muette et sans son affiche manquante", () => {
    renderCanopy(<CanopyBackground />);
    const element = video();
    expect(element).not.toBeNull();
    expect(element).toHaveAttribute("loop");
    expect(element).toHaveAttribute("playsinline");
    expect(element?.muted).toBe(true);
    expect(element).toHaveAttribute("poster", CANOP_CANOPY_SCENES.light.poster);
  });

  it("propose le webm avant le mp4", () => {
    renderCanopy(<CanopyBackground />);
    const sources = Array.from(document.querySelectorAll("video source"));
    expect(sources.map((s) => s.getAttribute("type"))).toEqual(["video/webm", "video/mp4"]);
    expect(sources[0]).toHaveAttribute("src", CANOP_CANOPY_SCENES.light.webm);
    expect(sources[1]).toHaveAttribute("src", CANOP_CANOPY_SCENES.light.mp4);
  });

  it("se replie sur le mp4 quand le webm echoue au decodage", () => {
    renderCanopy(<CanopyBackground />);
    const lecteur = video() as HTMLVideoElement;
    Object.defineProperty(lecteur, "currentSrc", { value: CANOP_CANOPY_SCENES.light.webm });

    fireEvent.error(lecteur);

    const sources = Array.from(document.querySelectorAll("video source"));
    expect(sources.map((s) => s.getAttribute("src"))).toEqual([CANOP_CANOPY_SCENES.light.mp4]);
    expect(video()).not.toBe(lecteur);
  });

  it("se replie aussi quand l'erreur est posee sans evenement", () => {
    vi.useFakeTimers();
    try {
      renderCanopy(<CanopyBackground />);
      const lecteur = video() as HTMLVideoElement;
      Object.defineProperty(lecteur, "currentSrc", { value: CANOP_CANOPY_SCENES.light.webm });
      Object.defineProperty(lecteur, "error", { value: { code: 3 } });

      act(() => {
        vi.advanceTimersByTime(MEDIA_WATCH_INTERVAL_MS + 1);
      });

      const sources = Array.from(document.querySelectorAll("video source"));
      expect(sources.map((s) => s.getAttribute("src"))).toEqual([CANOP_CANOPY_SCENES.light.mp4]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("ne boucle pas si le mp4 echoue a son tour", () => {
    renderCanopy(<CanopyBackground />);
    const premier = video() as HTMLVideoElement;
    Object.defineProperty(premier, "currentSrc", { value: CANOP_CANOPY_SCENES.light.webm });
    fireEvent.error(premier);

    const second = video() as HTMLVideoElement;
    Object.defineProperty(second, "currentSrc", { value: CANOP_CANOPY_SCENES.light.mp4 });
    fireEvent.error(second);

    expect(video()).toBe(second);
    expect(document.querySelectorAll("video source")).toHaveLength(1);
  });

  it("sert la scene sombre sur theme sombre", () => {
    renderCanopy(<CanopyBackground />, "dark");
    expect(video()).toHaveAttribute("poster", CANOP_CANOPY_SCENES.dark.poster);
  });

  it("fige une scene quand sceneMode l'impose", () => {
    renderCanopy(<CanopyBackground sceneMode="dark" />, "light");
    expect(video()).toHaveAttribute("poster", CANOP_CANOPY_SCENES.dark.poster);
  });

  it("remplace la video par l'affiche quand le mouvement est reduit", () => {
    mockMatchMedia(true);
    renderCanopy(<CanopyBackground />);
    expect(video()).toBeNull();
    const image = document.querySelector("img");
    expect(image).toHaveAttribute("src", CANOP_CANOPY_SCENES.light.poster);
  });

  it("remplace la video par l'affiche quand animated vaut false", () => {
    renderCanopy(<CanopyBackground animated={false} />);
    expect(video()).toBeNull();
    expect(document.querySelector("img")).toHaveAttribute("src", CANOP_CANOPY_SCENES.light.poster);
  });

  it("reste decoratif pour les technologies d'assistance", () => {
    renderCanopy(<CanopyBackground />);
    expect(video()).toHaveAttribute("aria-hidden", "true");
  });

  it("rend son contenu au-dessus de la scene", () => {
    renderCanopy(
      <CanopyBackground>
        <p>Bonjour</p>
      </CanopyBackground>,
    );
    expect(screen.getByText("Bonjour")).toBeInTheDocument();
  });
});

describe("resolveCanopyScene", () => {
  it("renvoie la scene embarquee sans surcharge", () => {
    expect(resolveCanopyScene("dark")).toEqual(CANOP_CANOPY_SCENES.dark);
  });

  it("fusionne une surcharge partielle", () => {
    const scene = resolveCanopyScene("light", {
      light: { webm: "https://cdn.qvl/canopy-light.webm" },
    });
    expect(scene.webm).toBe("https://cdn.qvl/canopy-light.webm");
    expect(scene.mp4).toBe(CANOP_CANOPY_SCENES.light.mp4);
    expect(scene.poster).toBe(CANOP_CANOPY_SCENES.light.poster);
  });

  it("ignore une surcharge visant l'autre theme", () => {
    const scene = resolveCanopyScene("dark", { light: { webm: "https://cdn.qvl/autre.webm" } });
    expect(scene).toEqual(CANOP_CANOPY_SCENES.dark);
  });
});

describe("canopyScenesFrom", () => {
  it("construit les six URL depuis la base publique", () => {
    expect(canopyScenesFrom(CANOPY_ASSET_BASE)).toEqual(CANOP_CANOPY_SCENES);
    expect(CANOP_CANOPY_SCENES.dark.webm).toBe("/canopui/video/canopy-dark.webm");
    expect(CANOP_CANOPY_SCENES.light.poster).toBe("/canopui/video/canopy-light-poster.jpg");
  });

  it("accepte une base terminee par une barre oblique sans la doubler", () => {
    expect(canopyScenesFrom("https://cdn.qvl/video/")).toEqual(
      canopyScenesFrom("https://cdn.qvl/video"),
    );
    expect(canopyScenesFrom("https://cdn.qvl/video/").light.mp4).toBe(
      "https://cdn.qvl/video/canopy-light.mp4",
    );
  });
});
