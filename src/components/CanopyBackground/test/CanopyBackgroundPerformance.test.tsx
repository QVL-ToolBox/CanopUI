import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { CanopThemeProvider } from "../../../theme";
import { CanopyBackground, CANOP_CANOPY_SCENES, canopyScenesFrom } from "..";

const NAVIGATOR_KEYS = [
  "connection",
  "deviceMemory",
  "hardwareConcurrency",
  "mediaCapabilities",
] as const;

type NavigatorKey = (typeof NAVIGATOR_KEYS)[number];

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
  class FakeIntersectionObserver {
    private readonly callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
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

  describe("sans niveau de qualite", () => {
    it("sert la video 1080p sur une machine capable", () => {
      renderCanopy(<CanopyBackground />);
      expect(sourceSrcs()).toEqual([CANOP_CANOPY_SCENES.light.webm, CANOP_CANOPY_SCENES.light.mp4]);
    });

    it.each([
      ["une connexion 2G", { connection: { effectiveType: "2g", downlink: 0.1, saveData: false } }],
      [
        "l'economie de donnees",
        { connection: { effectiveType: "4g", downlink: 20, saveData: true } },
      ],
      ["une connexion 3G", { connection: { effectiveType: "3g", downlink: 5, saveData: false } }],
      ["deviceMemory egal a 1", { deviceMemory: 1 }],
      ["1 coeur et 4 Go", { hardwareConcurrency: 1, deviceMemory: 4 }],
    ] as const)("sert toujours la video 1080p avec %s", (_label, overrides) => {
      Object.entries(overrides).forEach(([key, value]) => setNavigator(key as NavigatorKey, value));
      renderCanopy(<CanopyBackground />);
      expect(sourceSrcs()).toEqual([CANOP_CANOPY_SCENES.light.webm, CANOP_CANOPY_SCENES.light.mp4]);
    });

    it("garde la 1080p apres plusieurs evenements waiting ou stalled", () => {
      renderCanopy(<CanopyBackground />);
      const element = video() as HTMLVideoElement;
      becomeReady(element);
      fireEvent.playing(element);
      fireEvent.waiting(element);
      fireEvent.stalled(element);
      fireEvent.waiting(element);
      expect(sourceSrcs()).toEqual([CANOP_CANOPY_SCENES.light.webm, CANOP_CANOPY_SCENES.light.mp4]);
    });

    it("ne sert jamais de source 720p", () => {
      renderCanopy(<CanopyBackground />);
      expect(sourceSrcs().some((src) => src.includes("720"))).toBe(false);
    });
  });

  describe("image fixe", () => {
    it("n'affiche que l'affiche quand animated vaut false", () => {
      renderCanopy(<CanopyBackground animated={false} />);
      expectPosterOnly();
    });

    it("n'affiche que l'affiche quand le mouvement est reduit", () => {
      mockMatchMedia(true);
      renderCanopy(<CanopyBackground />);
      expectPosterOnly();
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

describe("canopyScenesFrom sans scene lite", () => {
  it("n'expose aucune variante lite pour chaque theme", () => {
    const scenes = canopyScenesFrom("https://cdn.qvl/video/");
    expect(scenes.light).not.toHaveProperty("lite");
    expect(scenes.dark).not.toHaveProperty("lite");
  });

  it("n'expose aucune variante lite dans les scenes par defaut", () => {
    expect(CANOP_CANOPY_SCENES.light).not.toHaveProperty("lite");
    expect(CANOP_CANOPY_SCENES.dark).not.toHaveProperty("lite");
  });

  it("ne reference aucune URL 720p", () => {
    expect(JSON.stringify(CANOP_CANOPY_SCENES)).not.toContain("720");
  });
});
