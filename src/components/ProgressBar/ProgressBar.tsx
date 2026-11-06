import { ProgressBarSegmented } from "./ProgressBarSegmented";
import { ProgressBarSingle } from "./ProgressBarSingle";
import type { CanopProgressBarColor, CanopProgressSegment } from "./progressBarHelpers";

export type { CanopProgressBarColor, CanopProgressSegment };

interface ProgressBarCommonProps {
  label?: string;
  color?: CanopProgressBarColor;
  animated?: boolean;
  ariaLabel?: string;
}

export interface CanopProgressBarSingleProps extends ProgressBarCommonProps {
  value?: number;
  showValue?: boolean;
  segments?: never;
  max?: never;
}

export interface CanopProgressBarSegmentedProps extends ProgressBarCommonProps {
  segments: CanopProgressSegment[];
  max?: number;
  value?: never;
  showValue?: never;
}

export type CanopProgressBarProps = CanopProgressBarSingleProps | CanopProgressBarSegmentedProps;

export function ProgressBar(props: CanopProgressBarProps) {
  const { label, color = "primary", animated = true, ariaLabel } = props;

  if (props.segments && props.segments.length > 0) {
    return (
      <ProgressBarSegmented
        segments={props.segments}
        label={label}
        color={color}
        max={props.max}
        animated={animated}
        ariaLabel={ariaLabel}
      />
    );
  }

  return (
    <ProgressBarSingle
      value={props.value ?? 0}
      label={label}
      color={color}
      showValue={props.showValue ?? false}
      animated={animated}
      ariaLabel={ariaLabel}
    />
  );
}
