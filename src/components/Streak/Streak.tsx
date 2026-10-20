import Box from "@mui/material/Box";
import { squircleSurface } from "../../squircle";
import { useTranslation } from "../../i18n";
import { Icon, type CanopIconName } from "../Icon";
import { Text } from "../Text";

export interface CanopStreakProps {
  /** Longueur de la série en cours. */
  value: number;
  /**
   * Multiplicateur atteint. Au-delà de 1, la série est dite chaude et se
   * colore : c'est la récompense visuelle de l'enchaînement.
   */
  multiplier?: number;
  icon?: CanopIconName;
  ariaLabel?: string;
}

/**
 * Une série en cours, avec son multiplicateur.
 *
 * L'état chaud se déduit du multiplicateur au lieu d'être passé à côté :
 * deux sources pour la même vérité finissent par se contredire, et c'est
 * l'affichage qui mentirait.
 */
export function Streak({ value, multiplier = 1, icon = "fire", ariaLabel }: CanopStreakProps) {
  const { t } = useTranslation();
  const chaude = multiplier > 1;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        paddingInline: "0.625rem",
        paddingBlock: "0.25rem",
        ...squircleSurface({
          radius: "0.75rem",
          background: chaude
            ? "color-mix(in srgb, var(--canop-palette-warning-main) 16%, var(--canop-palette-background-paper))"
            : "var(--canop-palette-surface-sunken, var(--canop-palette-background-paper))",
        }),
      }}
      aria-label={ariaLabel ?? t("canop.streak.label", { value })}
      role="status"
    >
      <Icon
        name={icon}
        variant={chaude ? "solid" : "outline"}
        size="sm"
        color={chaude ? "warning" : "neutral"}
      />
      <Text variant="label" tabularNums tone={chaude ? "default" : "muted"}>
        {value}
      </Text>
      {chaude && (
        <Text variant="label" tabularNums tone="warning" weight="bold">
          ×{multiplier}
        </Text>
      )}
    </Box>
  );
}
