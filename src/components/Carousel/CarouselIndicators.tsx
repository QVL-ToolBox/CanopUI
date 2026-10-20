import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { tokens } from "../../tokens";
import { squircleClip } from "../../squircle";
import { TOUCH_TARGET_MIN, touchPaddingFor } from "../_shared/touchTarget";
import type { CanopCarouselOrientation } from "./carouselHelpers";

export interface CarouselIndicatorsProps {
  ariaLabel: string;
  orientation?: CanopCarouselOrientation;
  count: number;
  activeIndex: number;
  autoPlaying?: boolean;
  interval?: number;
  slideLabel: (position: number) => string;
  onSelect: (index: number) => void;
}

const SAME_BAR_LENGTH_FOR_EVERY_CARD = "1.75rem";
const BAR_THICKNESS = "0.3125rem";
const BAR_RADIUS_HALF_THICKNESS = "0.15625rem";

const HIT_PADDING = tokens.spacing["3xs"];
const HIT_PADDING_COARSE = touchPaddingFor(BAR_THICKNESS);

const FILL = "canop-carousel-fill";

export function CarouselIndicators({
  ariaLabel,
  orientation = "horizontal",
  count,
  activeIndex,
  autoPlaying = false,
  interval,
  slideLabel,
  onSelect,
}: CarouselIndicatorsProps) {
  const isVertical = orientation === "vertical";
  const axis = isVertical ? "Y" : "X";

  return (
    <Stack
      direction={isVertical ? "column" : "row"}
      spacing={0.75}
      role="group"
      aria-label={ariaLabel}
      sx={[
        {
          justifyContent: "center",
          alignItems: "center",
        },
        isVertical
          ? {
              position: "absolute",
              top: "50%",
              right: tokens.spacing["2xs"],
              transform: "translateY(-50%)",
              zIndex: 2,
            }
          : { paddingTop: tokens.spacing.xs },
      ]}
    >
      {Array.from({ length: count }, (_, index) => {
        const active = index === activeIndex;
        return (
          <Box
            key={index}
            component="button"
            type="button"
            aria-current={active ? "true" : undefined}
            aria-label={slideLabel(index + 1)}
            onClick={() => onSelect(index)}
            sx={{
              border: "none",
              bgcolor: "transparent",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              appearance: "none",
              cursor: "pointer",
              padding: isVertical ? `${HIT_PADDING} 0` : `0 ${HIT_PADDING}`,

              "@media (pointer: coarse)": {
                padding: isVertical
                  ? `${HIT_PADDING} ${HIT_PADDING_COARSE}`
                  : `${HIT_PADDING_COARSE} ${HIT_PADDING}`,
                [isVertical ? "minWidth" : "minHeight"]: TOUCH_TARGET_MIN,
              },
            }}
          >
            <Box
              aria-hidden
              sx={{
                height: isVertical ? SAME_BAR_LENGTH_FOR_EVERY_CARD : BAR_THICKNESS,
                width: isVertical ? BAR_THICKNESS : SAME_BAR_LENGTH_FOR_EVERY_CARD,
                bgcolor: "divider",
                ...squircleClip(BAR_RADIUS_HALF_THICKNESS, { shape: "pill" }),
                overflow: "hidden",
                opacity: active ? 1 : 0.55,

                transition: (theme) =>
                  theme.transitions.create(["opacity"], {
                    duration: theme.transitions.duration.short,
                    easing: tokens.motion.easing.organic,
                  }),

                "button:hover > &": { opacity: 1 },
                "@media (prefers-reduced-motion: reduce)": { transition: "none" },
              }}
            >
              {active && (
                <Box
                  key={`${activeIndex}-${autoPlaying}`}
                  data-fill={autoPlaying && interval ? String(interval) : "static"}
                  sx={{
                    height: "100%",
                    width: "100%",
                    bgcolor: "primary.main",
                    transformOrigin: isVertical ? "top" : "left",

                    ...(autoPlaying && interval
                      ? {
                          animation: `${FILL} ${interval}ms linear forwards`,
                          [`@keyframes ${FILL}`]: {
                            from: { transform: `scale${axis}(0)` },
                            to: { transform: `scale${axis}(1)` },
                          },
                        }
                      : { transform: `scale${axis}(1)` }),
                  }}
                />
              )}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}
