export const shadowsLight = {
  e1: "0 0.0625rem 0.125rem rgba(20,30,24,0.06), 0 0.0625rem 0.1875rem rgba(20,30,24,0.10)",
  e2: "0 0.125rem 0.375rem rgba(20,30,24,0.08), 0 0.25rem 0.75rem rgba(20,30,24,0.10)",
  e3: "0 0.375rem 1rem rgba(20,30,24,0.12)",
  e4: "0 0.75rem 1.75rem rgba(20,30,24,0.16)",
  e5: "0 1.25rem 3rem rgba(20,30,24,0.22)",
} as const;

export const shadowsDark = {
  e1: "0 0.0625rem 0.125rem rgba(0,0,0,0.5), 0 0 0 0.0625rem rgba(157,225,196,0.04)",
  e2: "0 0.125rem 0.5rem rgba(0,0,0,0.55), 0 0 0 0.0625rem rgba(157,225,196,0.05)",
  e3: "0 0.375rem 1.125rem rgba(0,0,0,0.6), 0 0 0 0.0625rem rgba(157,225,196,0.06)",
  e4: "0 0.75rem 1.875rem rgba(0,0,0,0.65), 0 0 0 0.0625rem rgba(157,225,196,0.07)",
  e5: "0 1.5rem 3.5rem rgba(0,0,0,0.7), 0 0 0 0.0625rem rgba(157,225,196,0.08), 0 0 2.5rem rgba(157,225,196,0.05)",
} as const;

export const dropShadowsLight = {
  e1: "drop-shadow(0 0.0625rem 0.0625rem rgba(20,30,24,0.06)) drop-shadow(0 0.0625rem 0.125rem rgba(20,30,24,0.08))",
  e2: "drop-shadow(0 0.0625rem 0.125rem rgba(20,30,24,0.07)) drop-shadow(0 0.1875rem 0.375rem rgba(20,30,24,0.11))",
  e3: "drop-shadow(0 0.125rem 0.1875rem rgba(20,30,24,0.08)) drop-shadow(0 0.375rem 0.75rem rgba(20,30,24,0.15))",
  e4: "drop-shadow(0 0.1875rem 0.25rem rgba(20,30,24,0.09)) drop-shadow(0 0.625rem 1.25rem rgba(20,30,24,0.20))",
  e5: "drop-shadow(0 0.25rem 0.375rem rgba(20,30,24,0.10)) drop-shadow(0 1rem 2rem rgba(20,30,24,0.26))",
} as const;

export const dropShadowsDark = {
  e1: "drop-shadow(0 0.0625rem 0.0625rem rgba(0,0,0,0.50)) drop-shadow(0 0 0.0625rem rgba(157,225,196,0.04))",
  e2: "drop-shadow(0 0.125rem 0.25rem rgba(0,0,0,0.58)) drop-shadow(0 0 0.0625rem rgba(157,225,196,0.05))",
  e3: "drop-shadow(0 0.25rem 0.5rem rgba(0,0,0,0.66)) drop-shadow(0 0 0.0625rem rgba(157,225,196,0.06))",
  e4: "drop-shadow(0 0.5rem 0.875rem rgba(0,0,0,0.74)) drop-shadow(0 0 0.0625rem rgba(157,225,196,0.07))",
  e5: "drop-shadow(0 0.875rem 1.5rem rgba(0,0,0,0.82)) drop-shadow(0 0 0.0625rem rgba(157,225,196,0.08))",
} as const;

export const shadows = {
  light: shadowsLight,
  dark: shadowsDark,
  dropLight: dropShadowsLight,
  dropDark: dropShadowsDark,
} as const;

export type CanopShadowLevel = keyof typeof shadowsLight;
