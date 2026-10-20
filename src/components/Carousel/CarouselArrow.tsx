import Box from "@mui/material/Box";
import { useLayoutEffect, useRef, type RefObject } from "react";
import { IconActionButton } from "../IconActionButton";
import type { CanopCarouselOrientation } from "./carouselHelpers";

export type CarouselArrowDirection = "previous" | "next";

const ARROW_SIZE = "2rem";

export interface CarouselArrowProps {
  direction: CarouselArrowDirection;
  orientation?: CanopCarouselOrientation;
  label: string;
  disabled: boolean;
  onClick: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
  onDisabledWhileFocused: () => void;
}

export function CarouselArrow({
  direction,
  orientation = "horizontal",
  label,
  disabled,
  onClick,
  buttonRef,
  onDisabledWhileFocused,
}: CarouselArrowProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const hadFocusRef = useRef(false);
  const previousDisabledRef = useRef(disabled);
  const isPrevious = direction === "previous";
  const isVertical = orientation === "vertical";

  const rotateCaretDownAsMissingCaretUp = isVertical && isPrevious;

  useLayoutEffect(() => {
    buttonRef.current = wrapperRef.current?.querySelector("button") ?? null;
  });

  useLayoutEffect(() => {
    if (disabled && !previousDisabledRef.current && hadFocusRef.current) {
      hadFocusRef.current = false;
      onDisabledWhileFocused();
    }
    previousDisabledRef.current = disabled;
  }, [disabled, onDisabledWhileFocused]);

  return (
    <Box
      ref={wrapperRef}
      onFocus={() => {
        hadFocusRef.current = true;
      }}
      onBlur={() => {
        queueMicrotask(() => {
          hadFocusRef.current = false;
        });
      }}
      sx={[
        {
          flexShrink: 0,
        },
        rotateCaretDownAsMissingCaretUp ? { "& svg": { transform: "rotate(180deg)" } } : false,
      ]}
    >
      <IconActionButton
        icon={isVertical ? "caretDown" : isPrevious ? "caretLeft" : "caretRight"}
        ariaLabel={label}
        disabled={disabled}
        onClick={onClick}
        size={ARROW_SIZE}
        iconSize="sm"
      />
    </Box>
  );
}
