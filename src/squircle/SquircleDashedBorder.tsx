import { useCallback, useEffect, useRef, useState } from "react";
import { squirclePath, type CanopSuperellipseOptions } from "./superellipse";

export interface CanopSquircleDashedBorderProps extends CanopSuperellipseOptions {
  radius: string;
  color: string;
  width?: string;
  dash?: string;
}

interface BoxMetrics {
  width: number;
  height: number;
  radius: number;
}

function rootFontSize(): number {
  if (typeof window === "undefined") return 16;
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}

function resolveLength(node: Element, length: string): string {
  const variable = /^var\((--[^),]+)/.exec(length.trim());
  if (!variable) return length;
  return getComputedStyle(node).getPropertyValue(variable[1]).trim() || "0";
}

function toPixels(length: string): number {
  const value = parseFloat(length);
  if (Number.isNaN(value)) return 0;
  return length.trim().endsWith("rem") ? value * rootFontSize() : value;
}

export function SquircleDashedBorder({
  radius,
  color,
  width = "0.125rem",
  dash = "0.5rem 0.375rem",
  shape,
  exponent,
  segments,
}: CanopSquircleDashedBorderProps) {
  const [metrics, setMetrics] = useState<BoxMetrics | null>(null);
  const observer = useRef<ResizeObserver | null>(null);

  const measure = useCallback(
    (node: SVGSVGElement) => {
      const { width: measured, height } = node.getBoundingClientRect();
      if (measured <= 0 || height <= 0) {
        setMetrics(null);
        return;
      }
      setMetrics({
        width: measured,
        height,
        radius: toPixels(resolveLength(node, radius)),
      });
    },
    [radius],
  );

  const ref = useCallback(
    (node: SVGSVGElement | null) => {
      observer.current?.disconnect();
      if (!node) {
        setMetrics(null);
        return;
      }
      measure(node);
      if (typeof ResizeObserver === "undefined") return;
      observer.current = new ResizeObserver(() => measure(node));
      observer.current.observe(node);
    },
    [measure],
  );

  useEffect(() => () => observer.current?.disconnect(), []);

  const stroke = toPixels(width);
  const inset = stroke / 2;

  return (
    <svg
      ref={ref}
      aria-hidden
      focusable="false"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {metrics ? (
        <path
          d={squirclePath(metrics.width - stroke, metrics.height - stroke, metrics.radius, {
            shape,
            exponent,
            segments,
          })}
          transform={`translate(${inset} ${inset})`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={dash
            .split(/\s+/)
            .map((part) => toPixels(part))
            .join(" ")}
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}
