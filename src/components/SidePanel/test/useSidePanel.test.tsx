import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { PanInfo } from "framer-motion";
import type { ReactNode } from "react";
import { CanopThemeProvider } from "../../../theme";
import { motionDurationSeconds, motionEasing } from "../../../motion";
import {
  useSidePanel,
  type CanopSidePanelDragConfig,
  type UseSidePanelOptions,
} from "../useSidePanel";

type DragEndHandler = CanopSidePanelDragConfig["onDragEnd"];

function mockMatchMedia(matches: (query: string) => boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: matches(query),
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

const isNarrowViewport = (query: string) => query.includes("max-width");
const isReducedMotion = (query: string) => query.includes("prefers-reduced-motion");

function makeWrapper(mode: "light" | "dark") {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <CanopThemeProvider mode={mode}>{children}</CanopThemeProvider>;
  };
}

function dragInfo(offsetY: number, velocityY = 0): PanInfo {
  return {
    point: { x: 0, y: offsetY },
    delta: { x: 0, y: offsetY },
    offset: { x: 0, y: offsetY },
    velocity: { x: 0, y: velocityY },
  };
}

function renderSidePanel(initialProps: UseSidePanelOptions, mode: "light" | "dark" = "light") {
  return renderHook((props: UseSidePanelOptions) => useSidePanel(props), {
    initialProps,
    wrapper: makeWrapper(mode),
  });
}

function drag(onDragEnd: DragEndHandler | undefined, info: PanInfo) {
  act(() => {
    onDragEnd?.(new MouseEvent("mouseup"), info);
  });
}

describe("useSidePanel", () => {
  describe("tiroir lateral", () => {
    beforeEach(() => {
      mockMatchMedia(() => false);
    });

    it("glisse depuis la droite et n'expose aucun geste", () => {
      const { result } = renderSidePanel({ open: true, onClose: vi.fn() });
      expect(result.current.isBottomSheet).toBe(false);
      expect(result.current.dragConfig).toBeUndefined();
      expect(result.current.panelMotion.initial).toEqual({ x: "100%" });
    });

    it("anime le voile avec la duree de base en theme clair", () => {
      const { result } = renderSidePanel({ open: true, onClose: vi.fn() });
      expect(result.current.backdropMotion.animate).toMatchObject({ opacity: 0.44 });
      expect(result.current.backdropMotion.transition).toMatchObject({
        duration: motionDurationSeconds.base,
      });
    });

    it("assombrit davantage le voile en theme sombre", () => {
      const { result } = renderSidePanel({ open: true, onClose: vi.fn() }, "dark");
      expect(result.current.backdropMotion.animate).toMatchObject({ opacity: 0.62 });
    });

    it("garde le contenu monte jusqu'a la fin de l'animation de sortie", () => {
      const { result, rerender } = renderSidePanel({ open: true, onClose: vi.fn() });
      rerender({ open: false, onClose: vi.fn() });
      expect(result.current.render).toBe(true);
      act(() => {
        result.current.onExitComplete();
      });
      expect(result.current.render).toBe(false);
    });

    it("remonte le contenu a la reouverture", () => {
      const { result, rerender } = renderSidePanel({ open: false, onClose: vi.fn() });
      expect(result.current.render).toBe(false);
      rerender({ open: true, onClose: vi.fn() });
      expect(result.current.render).toBe(true);
    });

    it("ignore la fin d'animation tant que le panneau est ouvert", () => {
      const { result } = renderSidePanel({ open: true, onClose: vi.fn() });
      act(() => {
        result.current.onExitComplete();
      });
      expect(result.current.render).toBe(true);
    });
  });

  describe("feuille du bas", () => {
    beforeEach(() => {
      mockMatchMedia(isNarrowViewport);
    });

    it("glisse depuis le bas et expose un geste vertical", () => {
      const { result } = renderSidePanel({ open: true, onClose: vi.fn() });
      expect(result.current.isBottomSheet).toBe(true);
      expect(result.current.panelMotion.initial).toEqual({ y: "100%" });
      expect(result.current.dragConfig?.drag).toBe("y");
    });

    it("ne borne pas la course vers le bas, pour suivre le doigt au pixel", () => {
      const { result } = renderSidePanel({ open: true, onClose: vi.fn() });
      expect(result.current.dragConfig?.dragConstraints).toEqual({ top: 0 });
    });

    it("reste ou le doigt l'a laissee : ni retour a l'origine, ni inertie", () => {
      const { result } = renderSidePanel({ open: true, onClose: vi.fn() });
      expect(result.current.dragConfig).not.toHaveProperty("dragSnapToOrigin");
      expect(result.current.dragConfig?.dragMomentum).toBe(false);
    });

    it("bute franchement vers le haut, sans elastique qui redescendrait", () => {
      const { result } = renderSidePanel({ open: true, onClose: vi.fn() });
      expect(result.current.dragConfig?.dragElastic).toEqual({ top: 0, bottom: 0 });
    });

    it("n'ouvre pas avec un depassement, qui se lirait comme un retour tout seul", () => {
      const { result } = renderSidePanel({ open: true, onClose: vi.fn() });
      expect(result.current.panelMotion.transition).toMatchObject({
        ease: motionEasing.decelerate,
      });
    });

    it("ferme des le premier glissement vers le bas", () => {
      const onClose = vi.fn();
      const { result } = renderSidePanel({ open: true, onClose });
      drag(result.current.dragConfig?.onDragEnd, dragInfo(200));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("ferme sur une chiquenaude courte mais rapide", () => {
      const onClose = vi.fn();
      const { result } = renderSidePanel({ open: true, onClose });
      drag(result.current.dragConfig?.onDragEnd, dragInfo(40, 900));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it("retient un glissement long que le doigt a freine avant de lacher", () => {
      const onClose = vi.fn();
      const { result } = renderSidePanel({ open: true, onClose });
      drag(result.current.dragConfig?.onDragEnd, dragInfo(90, -200));
      expect(onClose).not.toHaveBeenCalled();
    });

    it("laisse la feuille a mi-hauteur quand le geste n'atteint pas le seuil", () => {
      const onClose = vi.fn();
      const { result } = renderSidePanel({ open: true, onClose });
      drag(result.current.dragConfig?.onDragEnd, dragInfo(60, 50));
      expect(onClose).not.toHaveBeenCalled();
      expect(result.current.panelMotion.animate).toEqual({ y: 0 });
    });

    it("ignore un glissement trop court", () => {
      const onClose = vi.fn();
      const { result } = renderSidePanel({ open: true, onClose });
      drag(result.current.dragConfig?.onDragEnd, dragInfo(20, 10));
      expect(onClose).not.toHaveBeenCalled();
    });

    it("ne ferme jamais sur un glissement vers le haut", () => {
      const onClose = vi.fn();
      const { result } = renderSidePanel({ open: true, onClose });
      drag(result.current.dragConfig?.onDragEnd, dragInfo(-200, -900));
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("mouvement reduit", () => {
    beforeEach(() => {
      mockMatchMedia((query) => isReducedMotion(query) || isNarrowViewport(query));
    });

    it("supprime les animations du panneau et du voile", () => {
      const { result } = renderSidePanel({ open: true, onClose: vi.fn() });
      expect(result.current.panelMotion.initial).toBe(false);
      expect(result.current.panelMotion.transition).toMatchObject({ duration: 0 });
      expect(result.current.backdropMotion.transition).toMatchObject({ duration: 0 });
      expect(result.current.backdropMotion.exit).toMatchObject({
        opacity: 0,
        transition: { duration: 0 },
      });
    });
  });
});
