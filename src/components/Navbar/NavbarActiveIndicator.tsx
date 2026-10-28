import { useSlidingIndicator } from "../../motion/useSlidingIndicator";
import { squircleClipPath } from "../../squircle";
import { activeIndicatorTransition } from "./activeIndicator";
import { NAVBAR_ACTIVE_FILL, NAVBAR_ACTIVE_HALO, NAVBAR_ACTIVE_SHADOW } from "./navbarTone";

export interface NavbarActiveIndicatorProps {
  radius: string;
}

export function NavbarActiveIndicator({ radius }: NavbarActiveIndicatorProps) {
  const { frameRef, pillRef } = useSlidingIndicator(activeIndicatorTransition);

  return (
    <span
      ref={frameRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        filter: NAVBAR_ACTIVE_HALO,
      }}
    >
      <span
        ref={pillRef}
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "0 0",
          clipPath: squircleClipPath(radius),
          backgroundColor: NAVBAR_ACTIVE_FILL,
          filter: NAVBAR_ACTIVE_SHADOW,
        }}
      />
    </span>
  );
}
