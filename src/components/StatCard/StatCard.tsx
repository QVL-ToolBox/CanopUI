import { motion } from "framer-motion";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEnterAnimation } from "../../motion";
import { tokens } from "../../tokens";
import { squircleClip } from "../../squircle";
import { overlineSx } from "../_shared/overlineSx";
import { Card, type CanopCardTone } from "../Card";
import { Icon, type CanopIconColor, type CanopIconName } from "../Icon";
import { useStatCard } from "./useStatCard";

const MotionStack = motion.create(Stack);

export interface CanopStatCardProps {
  label: string;
  value: string;
  variation?: number;
  variationLabel?: string;
  icon?: CanopIconName;
  iconColor?: CanopIconColor;
  positiveIsGood?: boolean;
  animated?: boolean;
  /**
   * Teinte la carte entiere selon ce que la valeur **signifie** : un solde
   * previsionnel positif en vert, negatif en rouge.
   *
   * A distinguer de `iconColor`, qui n'habille que l'icone, et de `variation`,
   * qui parle de l'ecart et non du niveau. C'est le seul des trois qui repond a
   * « cette valeur est-elle une bonne nouvelle ». Les applications le
   * dessinaient a la main, avec un `color-mix` sur la bordure et le fond.
   */
  tone?: CanopCardTone;
  onClick?: () => void;
  ariaLabel?: string;
}

function tintSource(iconColor: CanopIconColor): string {
  if (iconColor === "neutral") {
    return "var(--canop-palette-text-disabled)";
  }
  const base = iconColor === "inherit" ? "primary" : iconColor;
  return `var(--canop-palette-${base}-main)`;
}

function tintColor(iconColor: CanopIconColor): string {
  return `color-mix(in srgb, ${tintSource(iconColor)} 12%, transparent)`;
}

export function StatCard({
  label,
  value,
  variation,
  variationLabel,
  icon,
  iconColor = "primary",
  positiveIsGood = true,
  animated = true,
  tone = "neutral",
  onClick,
  ariaLabel,
}: CanopStatCardProps) {
  const { hasVariation, variationColor, variationText } = useStatCard({
    variation,
    positiveIsGood,
  });
  const enter = useEnterAnimation({ direction: "up", distance: "0.5rem", disabled: !animated });

  return (
    <Card variant="stat" tone={tone} onClick={onClick} ariaLabel={ariaLabel}>
      <MotionStack
        spacing={1.5}
        initial={enter.initial}
        animate={enter.animate}
        transition={enter.transition}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Typography
            component="span"
            sx={{
              color: "text.secondary",
              fontFamily: tokens.typography.fontFamily,
              ...overlineSx,
            }}
          >
            {label}
          </Typography>
          {icon ? (
            <Stack
              sx={{
                alignItems: "center",
                justifyContent: "center",
                width: "2.5rem",
                height: "2.5rem",
                flexShrink: 0,
                ...squircleClip("var(--canop-radius-md)"),
                backgroundColor: tintColor(iconColor),
              }}
            >
              <Icon name={icon} size="sm" color={iconColor} />
            </Stack>
          ) : null}
        </Stack>

        <Typography
          component="span"
          sx={{
            color: "text.primary",
            fontFamily: tokens.typography.fontFamily,
            ...tokens.typography.app.metric,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </Typography>

        {hasVariation ? (
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              alignItems: "baseline",
            }}
          >
            <Typography
              component="span"
              sx={{
                color: variationColor,
                fontFamily: tokens.typography.fontFamily,
                ...tokens.typography.app.label,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {variationText}
            </Typography>
            {variationLabel ? (
              <Typography
                component="span"
                variant="caption"
                sx={{
                  color: "text.secondary",
                }}
              >
                {variationLabel}
              </Typography>
            ) : null}
          </Stack>
        ) : null}
      </MotionStack>
    </Card>
  );
}
