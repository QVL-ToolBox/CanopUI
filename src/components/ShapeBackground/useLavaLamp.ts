import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { placeLavaGlows } from "./lavaGlowPlacement";
import { runLavaLoop, type LavaClock } from "./lavaLoop";
import { lavaMasses, type LavaMass } from "./lavaMasses";
import type { LavaSettings } from "./lavaRecipe";
import {
  createLavaScene,
  measureLava,
  paintLava,
  type LavaLayout,
  type LavaScene,
} from "./lavaScene";
import type { LavaMotionState } from "./useLavaMotion";
import { useLavaInks } from "./useLavaInks";

export interface LavaLamp {
  canvasRef: (node: HTMLCanvasElement | null) => void;
  glowRef: (node: HTMLDivElement | null) => void;
  masses: LavaMass[];
}

const STILL_SECONDS = 0;

export function useLavaLamp(
  { hue, mode, masses: massCount, intensity }: LavaSettings,
  { moving, running }: LavaMotionState,
): LavaLamp {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [clock] = useState<LavaClock>(() => ({ seconds: STILL_SECONDS }));
  const inks = useLavaInks(canvas, hue, mode);
  const masses = useMemo(() => lavaMasses(massCount), [massCount]);
  const glowNodeRef = useRef<HTMLDivElement | null>(null);
  const layoutRef = useRef<LavaLayout | null>(null);
  const sceneRef = useRef<LavaScene | null>(null);

  const glowRef = useCallback((node: HTMLDivElement | null) => {
    glowNodeRef.current = node;
  }, []);

  const draw = useCallback(() => {
    const layout = layoutRef.current;
    const scene = sceneRef.current;
    if (!layout || !scene) return;
    paintLava(scene, layout, clock.seconds);
    placeLavaGlows(glowNodeRef.current, scene, layout);
  }, [clock]);

  useEffect(() => {
    sceneRef.current = createLavaScene(masses, inks, intensity);
    if (layoutRef.current) layoutRef.current.grid.painted = false;
    draw();
  }, [inks, masses, intensity, draw]);

  useEffect(() => {
    if (!canvas || typeof ResizeObserver === "undefined") return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      layoutRef.current = measureLava(canvas, context, width, height);
      draw();
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvas, draw]);

  useEffect(() => {
    if (moving) return;
    clock.seconds = STILL_SECONDS;
    draw();
  }, [moving, clock, draw]);

  useEffect(() => {
    if (!running) return;
    return runLavaLoop({ clock, draw });
  }, [running, clock, draw]);

  return { canvasRef: setCanvas, glowRef, masses };
}
