import Box from "@mui/material/Box";
import { useTranslation } from "../../i18n";
import { useReducedMotion } from "../../motion";
import type { CanopIconName, CanopIconSize } from "../Icon";
import { LivesHeart } from "./LivesHeart";
import { useLives } from "./useLives";

export interface CanopLivesProps {
  value: number;
  max: number;
  icon?: CanopIconName;
  size?: CanopIconSize;
  animated?: boolean;
  ariaLabel?: string;
}

export function Lives({
  value,
  max,
  icon = "heart",
  size = "sm",
  animated = true,
  ariaLabel,
}: CanopLivesProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const play = animated && !reduced;
  const { remaining, cells, fading } = useLives(value, max, play);

  return (
    <Box
      role="img"
      aria-label={ariaLabel ?? t("canop.lives.label", { count: remaining, max })}
      sx={{
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.25rem",
        maxWidth: "100%",
      }}
    >
      {cells.map((filled, index) => (
        <LivesHeart
          key={index}
          icon={icon}
          size={size}
          filled={filled}
          fading={fading === index}
          animated={play}
        />
      ))}
    </Box>
  );
}
