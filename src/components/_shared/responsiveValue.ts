import { tokens, type CanopBreakpoint } from "../../tokens";

type ResponsiveStep = string | number | boolean;

type PerBreakpoint<T> = Partial<Record<CanopBreakpoint, T>>;

export type CanopResponsiveValue<T extends ResponsiveStep> = T | PerBreakpoint<T>;

function isBreakpoint(key: string): key is CanopBreakpoint {
  return key in tokens.breakpoints.values;
}

export const BREAKPOINTS: readonly CanopBreakpoint[] = Object.keys(
  tokens.breakpoints.values,
).filter(isBreakpoint);

function isPerBreakpoint<T extends ResponsiveStep>(
  value: CanopResponsiveValue<T>,
): value is PerBreakpoint<T> {
  return typeof value === "object";
}

export function mapResponsive<T extends ResponsiveStep, R>(
  value: CanopResponsiveValue<T>,
  map: (step: T) => R,
): R | PerBreakpoint<R> {
  if (!isPerBreakpoint(value)) return map(value);
  const mapped: PerBreakpoint<R> = {};
  for (const breakpoint of BREAKPOINTS) {
    const step = value[breakpoint];
    if (step !== undefined) mapped[breakpoint] = map(step);
  }
  return mapped;
}
