import SvgIcon from "@mui/material/SvgIcon";
import { squirclePath } from "../../squircle";

export type CanopCheckboxIconState = "empty" | "checked" | "indeterminate";

export interface SquircleCheckboxIconProps {
  state: CanopCheckboxIconState;
}

const BOX_INSET = 3;
const BOX_SIZE = 18;
const BOX_RADIUS = 8;
const STROKE = 2;

const outline = squirclePath(BOX_SIZE - STROKE, BOX_SIZE - STROKE, BOX_RADIUS - STROKE / 2);
const solid = squirclePath(BOX_SIZE, BOX_SIZE, BOX_RADIUS);

export function SquircleCheckboxIcon({ state }: SquircleCheckboxIconProps) {
  const filled = state !== "empty";

  return (
    <SvgIcon viewBox="0 0 24 24">
      <g transform={`translate(${BOX_INSET} ${BOX_INSET})`}>
        {filled ? (
          <path d={solid} fill="currentColor" />
        ) : (
          <path
            d={outline}
            transform={`translate(${STROKE / 2} ${STROKE / 2})`}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
          />
        )}
        {state === "checked" ? (
          <path
            d="M 4 9.4 L 7.3 12.7 L 14 5.6"
            fill="none"
            stroke="var(--canop-palette-primary-contrastText)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
        {state === "indeterminate" ? (
          <path
            d="M 4.5 9 L 13.5 9"
            fill="none"
            stroke="var(--canop-palette-primary-contrastText)"
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        ) : null}
      </g>
    </SvgIcon>
  );
}
