import type { CanopBentoSpan, CanopIconName } from "@canop/ui";
import type { HomeFeatureId } from "./homeTexts";

export type HomeFeatureDemo = "squircle" | "glass" | "neon";

export interface HomeFeatureLayout {
  id: HomeFeatureId;
  icon: CanopIconName;
  path: string;
  span: CanopBentoSpan;
  demo?: HomeFeatureDemo;
}

export const HOME_FEATURES: readonly HomeFeatureLayout[] = [
  { id: "squircle", icon: "layout", path: "/components/card", span: { sm: 2 }, demo: "squircle" },
  { id: "glass", icon: "diamond", path: "/components/canopy-background", span: 1, demo: "glass" },
  { id: "access", icon: "eye", path: "/docs/focus", span: 1 },
  { id: "neon", icon: "lightbulb", path: "/docs/theming", span: { sm: 2 }, demo: "neon" },
  { id: "i18n", icon: "globe", path: "/components/i18n", span: 1 },
  { id: "season", icon: "pumpkin", path: "/components/halloween-decor", span: 1 },
  { id: "typed", icon: "shield", path: "/docs/installation", span: { sm: 2, md: 1 } },
];
