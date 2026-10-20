import type { CSSProperties } from "react";
import { paletteColorVar, type CanopPaletteColorName } from "../_shared/paletteColorVar";
import { icons, type CanopIconName } from "./icons";

export type CanopIconVariant = "outline" | "solid";

export type CanopIconSize = "xs" | "sm" | "md" | "lg" | "xl";

export type CanopIconColor = CanopPaletteColorName | "neutral" | "inherit";

const sizeMap: Record<CanopIconSize, string> = {
  xs: "1rem",
  sm: "1.25rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
};

const colorMap: Record<CanopIconColor, string> = {
  ...paletteColorVar,
  neutral: "var(--canop-palette-text-disabled)",
  inherit: "currentColor",
};

export interface CanopIconProps {
  name: CanopIconName;
  variant?: CanopIconVariant;
  size?: CanopIconSize;
  color?: CanopIconColor;
  /** Intitulé de l'icône, et nom accessible par défaut. */
  title?: string;
  /** Nom accessible explicite. Prend le pas sur `title`. */
  ariaLabel?: string;
  /**
   * Classe appliquee au SVG. Indispensable : les composants MUI qui acceptent
   * une icone la **clonent pour y injecter leur propre classe** -- `Chip` avec
   * `MuiChip-icon`, `Badge`, `Tab`... Sans cette prop, la classe est perdue et
   * l'icone perd du meme coup les marges que le composant hote lui destinait.
   */
  className?: string;
}

export function Icon({
  name,
  variant = "outline",
  size = "md",
  color = "inherit",
  title,
  ariaLabel,
  className,
}: CanopIconProps) {
  const Svg = icons[name][variant];
  const dimension = sizeMap[size];
  const accessibleName = ariaLabel ?? title;
  const style: CSSProperties = {
    color: colorMap[color],
    display: "inline-flex",
    verticalAlign: "middle",
  };
  return (
    <Svg
      width={dimension}
      height={dimension}
      className={className}
      style={style}
      role={accessibleName ? "img" : undefined}
      aria-label={accessibleName}
      aria-hidden={accessibleName ? undefined : true}
      focusable={false}
    />
  );
}
