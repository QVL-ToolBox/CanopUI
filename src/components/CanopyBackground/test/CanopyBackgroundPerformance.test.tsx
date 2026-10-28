import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import {
  CanopyBackground,
  CANOP_CANOPY_SCENES,
  canopyScenesFrom,
  type CanopCanopyQualityState,
} from "..";

const NAVIGATOR_KEYS = [
  "connection",
  "deviceMemory",
  "hardwareConcurrency",
  "mediaCapabilities",
] as const;

type NavigatorKey = (typeof NAVIGATOR_KEYS)[number];

let observerCallbacks: IntersectionObserverCallback[] = [];
let playSpy: ReturnType<typeof vi.fn>;
let pauseSpy: ReturnType<typeof vi.fn>;
let hidden = false;

function mockMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reducedMotion && query.includes("reduce"),
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

function setNavigator(key: NavigatorKey, value: unknown) {
  const realistic =
    key === "connection" && typeof value === "object" && value !== null
      ? Object.assign(new EventTarget(), value)
      : value;
  Object.defineProperty(navigator, key, { configurable: true, writable: true, value: realistic });
}

function becomeReady(element: HTMLVideoElement) {
  Object.defineProperty(element, "readyState", {
    configurable: true,
    value: HTMLMediaElement.HAVE_ENOUGH_DATA,
  });
  fireEvent.canPlay(element);
}

function setPaused(element: HTMLMediaElement, paused: boolean) {
  Object.defineProperty(element, "paused", { configurable: true, value: paused });
}

function capableDevice() {
  setNavigator("connection", { effectiveType: "4g", downlink: 20, saveData: false });
  setNavigator("deviceMemory", 8);
  setNavigator("hardwareConcurrency", 8);
}

function installIntersectionObserver() {
  observerCallbacks = [];
  class FakeIntersectionObserver {
    private readonly callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
      observerCallbacks.push(callback);
    }
    observe(target: Element) {
      this.callback(
        [{ target, isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    writable: true,
    value: FakeIntersectionObserver,
  });
}

function intersect(isIntersecting: boolean) {
  act(() => {
    observerCallbacks.forEach((callback) =>
      callback(
        [
          {
            isIntersecting,
            intersectionRatio: isIntersecting ? 1 : 0,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      ),
    );
  });
}

function setTabHidden(value: boolean) {
  hidden = value;
  act(() => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
}

function renderCanopy(ui: ReactNode) {
  return render(<CanopThemeProvider defaultMode="light">{ui}</CanopThemeProvider>);
}

function video(): HTMLVideoElement | null {
  return document.querySelector("video");
}

function sourceSrcs(): string[] {
  return Array.from(document.querySelectorAll("video source")).map(
    (source) => source.getAttribute("src") ?? "",
  );
}

function sourceTypes(): string[] {
  return Array.from(document.querySelectorAll("video source")).map(
    (source) => source.getAttribute("type") ?? "",
  );
}

function expectPosterOnly() {
  expect(video()).toBeNull();
  expect(document.querySelector("img")).toHaveAttribute("src", CANOP_CANOPY_SCENES.light.poster);
}

const lite = canopyScenesFrom("/canopui/video").light.lite;

describe("CanopyBackground optimise", () => {
  beforeEach(() => {
    mockMatchMedia(false);
    capableDevice();
    installIntersectionObserver();
    hidden = false;
    Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden });
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => (hidden ? "hidden" : "visible"),
    });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1920 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 1080 });
    playSpy = vi.fn(function play(this: HTMLMediaElement) {
      setPaused(this, false);
      this.dispatchEvent(new Event("play"));
      return Promise.resolve();
    });
    pauseSpy = vi.fn(function pause(this: HTMLMediaElement) {
      setPaused(this, true);
      this.dispatchEvent(new Event("pause"));
    });
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      writable: true,
      value: playSpy,
    });
    Object.defineProperty(HTMLMediaElement.prototype, "pause", {
      configurable: true,
      writable: true,
      value: pauseSpy,
    });
  });

  afterEach(() => {
    NAVIGATOR_KEYS.forEach((key) => {
      Reflect.deleteProperty(navigator, key);
    });
  });

  describe("prop quality", () => {
    it("sert la video 1080p sans prop quality sur une machine capable", () => {
      renderCanopy(<CanopyBackground />);
      expect(sourceSrcs()).toEqual([CANOP_CANOPY_SCENES.light.webm, CANOP_CANOPY_SCENES.light.mp4]);
    });

    it("se comporte comme auto quand quality vaut auto explicitement", () => {
      setNavigator("connection", { effectiveType: "2g", downlink: 0.1, saveData: false });
      renderCanopy(<CanopyBackground quality="auto" />);
      expectPosterOnly();
    });

    it("applique auto par defaut sur une connexion 2G", () => {
      setNavigator("connection", { effectiveType: "2g", downlink: 0.1, saveData: false });
      renderCanopy(<CanopyBackground />);
      expectPosterOnly();
    });

    it("sert la video 1080p en high meme sur un appareil modeste", () => {
      setNavigator("deviceMemory", 1);
      setNavigator("connection", { effectiveType: "3g", downlink: 0.5, saveData: false });
      renderCanopy(<CanopyBackground quality="high" />);
      expect(sourceSrcs()).toEqual([CANOP_CANOPY_SCENES.light.webm, CANOP_CANOPY_SCENES.light.mp4]);
    });

    it("n'affiche que l'affiche en low sur une machine capable", () => {
      renderCanopy(<CanopyBackground quality="low" />);
      expectPosterOnly();
    });
  });

  describe("quality auto", () => {
    it("n'affiche que l'affiche quand l'economie de donnees est active", () => {
      setNavigator("connection", { effectiveType: "4g", downlink: 20, saveData: true });
      renderCanopy(<CanopyBackground />);
      expectPosterOnly();
    });

    it("n'affiche que l'affiche sur slow-2g", () => {
      setNavigator("connection", { effectiveType: "slow-2g", downlink: 0.05, saveData: false });
      renderCanopy(<CanopyBackground />);
      expectPosterOnly();
    });

    it.each([
      ["une connexion 3G", { connection: { effectiveType: "3g", downlink: 5, saveData: false } }],
      [
        "un debit inferieur a 2 Mb/s",
        { connection: { effectiveType: "4g", downlink: 1.5, saveData: false } },
      ],
      ["deviceMemory egal a 2", { deviceMemory: 2 }],
      ["deviceMemory inferieur a 2", { deviceMemory: 1 }],
      ["2 coeurs et 4 Go", { hardwareConcurrency: 2, deviceMemory: 4 }],
      ["1 coeur et 4 Go", { hardwareConcurrency: 1, deviceMemory: 4 }],
    ] as const)("sert la variante 720p avec %s", (_label, overrides) => {
      Object.entries(overrides).forEach(([key, value]) => setNavigator(key as NavigatorKey, value));
      renderCanopy(<CanopyBackground />);
      expect(video()).not.toBeNull();
      expect(sourceSrcs()).toEqual([lite?.webm, lite?.mp4]);
    });

    it.each([
      [
        "un debit de 2 Mb/s pile",
        { connection: { effectiveType: "4g", downlink: 2, saveData: false } },
      ],
      ["deviceMemory de 4 avec 8 coeurs", { deviceMemory: 4, hardwareConcurrency: 8 }],
      ["2 coeurs avec 8 Go", { hardwareConcurrency: 2, deviceMemory: 8 }],
      ["4 coeurs avec 4 Go", { hardwareConcurrency: 4, deviceMemory: 4 }],
    ] as const)("garde la 1080p avec %s", (_label, overrides) => {
      Object.entries(overrides).forEach(([key, value]) => setNavigator(key as NavigatorKey, value));
      renderCanopy(<CanopyBackground />);
      expect(sourceSrcs()).toEqual([CANOP_CANOPY_SCENES.light.webm, CANOP_CANOPY_SCENES.light.mp4]);
    });

    it("garde la 1080p quand le navigateur n'expose aucune information reseau ni materielle", () => {
      NAVIGATOR_KEYS.forEach((key) => setNavigator(key, undefined));
      renderCanopy(<CanopyBackground />);
      expect(sourceSrcs()).toEqual([CANOP_CANOPY_SCENES.light.webm, CANOP_CANOPY_SCENES.light.mp4]);
    });
  });

  describe("onQualityChange", () => {
    it.each([
      ["high", "high", {}],
      ["low", "low", {}],
      ["low", "auto", { connection: { effectiveType: "4g", downlink: 20, saveData: true } }],
      ["medium", "auto", { deviceMemory: 2 }],
      ["high", "auto", {}],
    ] as const)(
      "annonce le niveau %s en quality %s avec sa raison",
      (level, quality, overrides) => {
        Object.entries(overrides).forEach(([key, value]) =>
          setNavigator(key as NavigatorKey, value),
        );
        const onQualityChange = vi.fn();
        renderCanopy(<CanopyBackground quality={quality} onQualityChange={onQualityChange} />);
        expect(onQualityChange).toHaveBeenCalled();
        const [state] = onQualityChange.mock.calls.at(-1) ?? [];
        expect(state.level).toBe(level);
        expect(typeof state.reason).toBe("string");
        expect(state.reason.length).toBeGreaterThan(0);
      },
    );

    it("annonce low pour la raison disabled quand animated vaut false", () => {
      const onQualityChange = vi.fn();
      renderCanopy(<CanopyBackground animated={false} onQualityChange={onQualityChange} />);
      expect(onQualityChange).toHaveBeenLastCalledWith({ level: "low", reason: "disabled" });
    });

    it("annonce low pour la raison reduced-motion quand le mouvement est reduit", () => {
      mockMatchMedia(true);
      const onQualityChange = vi.fn();
      renderCanopy(<CanopyBackground onQualityChange={onQualityChange} />);
      expect(onQualityChange).toHaveBeenLastCalledWith({ level: "low", reason: "reduced-motion" });
    });
  });

  describe("mise en tampon", () => {
    function startPlaying(onQualityChange: (state: CanopCanopyQualityState) => void) {
      renderCanopy(<CanopyBackground onQualityChange={onQualityChange} />);
      const element = video() as HTMLVideoElement;
      becomeReady(element);
      fireEvent.playing(element);
      return element;
    }

    it("garde la 1080p apres un seul evenement waiting", () => {
      const onQualityChange = vi.fn();
      const element = startPlaying(onQualityChange);
      fireEvent.waiting(element);
      expect(onQualityChange).toHaveBeenLastCalledWith({ level: "high", reason: "capable" });
      expect(sourceSrcs()).toEqual([CANOP_CANOPY_SCENES.light.webm, CANOP_CANOPY_SCENES.light.mp4]);
    });

    it("descend d'un cran apres deux evenements waiting ou stalled", () => {
      const onQualityChange = vi.fn();
      const element = startPlaying(onQualityChange);
      fireEvent.waiting(element);
      fireEvent.stalled(element);
      expect(onQualityChange).toHaveBeenLastCalledWith({ level: "medium", reason: "buffering" });
      expect(sourceSrcs()).toEqual([lite?.webm, lite?.mp4]);
    });

    it("ne remonte jamais en 1080p apres une descente pour mise en tampon", () => {
      const onQualityChange = vi.fn();
      const element = startPlaying(onQualityChange);
      fireEvent.waiting(element);
      fireEvent.waiting(element);
      const degraded = video() as HTMLVideoElement;
      becomeReady(degraded);
      fireEvent.playing(degraded);
      fireEvent.playing(degraded);
      const levels = onQualityChange.mock.calls.map(([state]) => state.level);
      expect(levels.slice(levels.indexOf("medium"))).not.toContain("high");
      expect(sourceSrcs()).toEqual([lite?.webm, lite?.mp4]);
    });
  });

  describe("apparition de la video", () => {
    it("affiche le poster immediatement et masque la video jusqu'a playing", () => {
      renderCanopy(<CanopyBackground />);
      const element = video() as HTMLVideoElement;
      expect(element).toHaveAttribute("poster", CANOP_CANOPY_SCENES.light.poster);
      expect(element).toHaveStyle({ opacity: "0" });

      becomeReady(element);
      expect(element).toHaveStyle({ opacity: "0" });

      fireEvent.playing(element);
      expect(video()).not.toHaveStyle({ opacity: "0" });
    });
  });

  describe("pause hors ecran et onglet cache", () => {
    it("met en pause quand l'onglet est cache puis reprend quand il revient", () => {
      renderCanopy(<CanopyBackground />);
      becomeReady(video() as HTMLVideoElement);
      fireEvent.playing(video() as HTMLVideoElement);
      playSpy.mockClear();

      setTabHidden(true);
      expect(pauseSpy).toHaveBeenCalled();

      setTabHidden(false);
      expect(playSpy).toHaveBeenCalled();
    });

    it("met en pause hors ecran puis reprend au retour dans le viewport", () => {
      renderCanopy(<CanopyBackground />);
      becomeReady(video() as HTMLVideoElement);
      fireEvent.playing(video() as HTMLVideoElement);
      expect(observerCallbacks.length).toBeGreaterThan(0);
      playSpy.mockClear();

      intersect(false);
      expect(pauseSpy).toHaveBeenCalled();

      intersect(true);
      expect(playSpy).toHaveBeenCalled();
    });
  });

  describe("lecture robuste", () => {
    it("rend une video muette et inline", () => {
      renderCanopy(<CanopyBackground />);
      const element = video() as HTMLVideoElement;
      expect(element.muted).toBe(true);
      expect(element).toHaveAttribute("playsinline");
    });

    it("appelle play quand la video est prete", () => {
      renderCanopy(<CanopyBackground />);
      playSpy.mockClear();
      becomeReady(video() as HTMLVideoElement);
      expect(playSpy).toHaveBeenCalled();
    });

    it.each(["pointerdown", "touchend", "keydown"])(
      "retente play au premier %s quand l'autoplay est bloque",
      async (eventType) => {
        playSpy.mockRejectedValue(new DOMException("blocked", "NotAllowedError"));
        renderCanopy(<CanopyBackground />);
        await act(async () => {
          becomeReady(video() as HTMLVideoElement);
        });
        const callsBeforeGesture = playSpy.mock.calls.length;
        expect(callsBeforeGesture).toBeGreaterThan(0);

        await act(async () => {
          document.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
        expect(playSpy.mock.calls.length).toBeGreaterThan(callsBeforeGesture);
      },
    );

    it("ne retente plus play apres le demontage", async () => {
      playSpy.mockRejectedValue(new DOMException("blocked", "NotAllowedError"));
      const { unmount } = renderCanopy(<CanopyBackground />);
      await act(async () => {
        becomeReady(video() as HTMLVideoElement);
      });
      unmount();
      playSpy.mockClear();

      await act(async () => {
        ["pointerdown", "touchend", "keydown"].forEach((eventType) =>
          document.dispatchEvent(new Event(eventType, { bubbles: true })),
        );
      });
      expect(playSpy).not.toHaveBeenCalled();
    });

    it("retire les ecouteurs du document au demontage", async () => {
      playSpy.mockRejectedValue(new DOMException("blocked", "NotAllowedError"));
      const removeSpy = vi.spyOn(document, "removeEventListener");
      const { unmount } = renderCanopy(<CanopyBackground />);
      await act(async () => {
        becomeReady(video() as HTMLVideoElement);
      });
      unmount();
      const removed = removeSpy.mock.calls.map(([eventType]) => eventType);
      expect(removed).toEqual(expect.arrayContaining(["pointerdown", "touchend", "keydown"]));
      removeSpy.mockRestore();
    });
  });

  describe("mouvement reduit", () => {
    it("n'affiche que l'affiche meme en quality high", () => {
      mockMatchMedia(true);
      renderCanopy(<CanopyBackground quality="high" />);
      expectPosterOnly();
    });
  });

  describe("ordre des sources", () => {
    function mockCodecSupport(vp9Efficient: boolean, h264Efficient: boolean) {
      setNavigator("mediaCapabilities", {
        decodingInfo: vi.fn(async (config: MediaDecodingConfiguration) => {
          const isWebm = config.video?.contentType.includes("webm") ?? false;
          const efficient = isWebm ? vp9Efficient : h264Efficient;
          return { supported: true, smooth: efficient, powerEfficient: efficient };
        }),
      });
    }

    async function renderFreshCanopy() {
      vi.resetModules();
      const theme = await import("../../../theme");
      const component = await import("..");
      render(
        <theme.CanopThemeProvider defaultMode="light">
          <component.CanopyBackground />
        </theme.CanopThemeProvider>,
      );
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    }

    it("met le MP4 en premier quand VP9 n'est pas efficace et H.264 l'est", async () => {
      mockCodecSupport(false, true);
      await renderFreshCanopy();
      await waitFor(() => expect(sourceTypes()).toEqual(["video/mp4", "video/webm"]));
    });

    it.each([
      ["VP9 et H.264 efficaces", true, true],
      ["VP9 efficace et H.264 non", true, false],
      ["aucun des deux efficace", false, false],
    ])("garde le WebM en premier quand %s", async (_label, vp9, h264) => {
      mockCodecSupport(vp9, h264);
      await renderFreshCanopy();
      expect(sourceTypes()).toEqual(["video/webm", "video/mp4"]);
    });

    it("garde le WebM en premier sans mediaCapabilities", async () => {
      setNavigator("mediaCapabilities", undefined);
      await renderFreshCanopy();
      expect(sourceTypes()).toEqual(["video/webm", "video/mp4"]);
    });
  });
});

describe("canopyScenesFrom lite", () => {
  it("expose les chemins 720p pour chaque theme", () => {
    const scenes = canopyScenesFrom("https://cdn.qvl/video/");
    expect(scenes.light.lite).toEqual({
      webm: "https://cdn.qvl/video/canopy-light-720.webm",
      mp4: "https://cdn.qvl/video/canopy-light-720.mp4",
    });
    expect(scenes.dark.lite).toEqual({
      webm: "https://cdn.qvl/video/canopy-dark-720.webm",
      mp4: "https://cdn.qvl/video/canopy-dark-720.mp4",
    });
  });

  it("expose lite dans les scenes par defaut", () => {
    expect(CANOP_CANOPY_SCENES.light.lite?.webm).toBe("/canopui/video/canopy-light-720.webm");
    expect(CANOP_CANOPY_SCENES.dark.lite?.mp4).toBe("/canopui/video/canopy-dark-720.mp4");
  });
});
