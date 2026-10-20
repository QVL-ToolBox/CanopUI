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

/**
 * Barre simple : `value` est un **pourcentage**, de 0 à 100.
 *
 * `max` et `segments` sont refusés ici, et c'est le cœur du correctif : la
 * barre simple n'a jamais lu `max`, elle l'acceptait sans rien en faire. Un
 * `value={acquis} max={101}` s'affichait donc juste **par coïncidence**, un
 * total proche de cent tenant lieu de pourcentage. Aucune erreur, un affichage
 * faux dès que le total s'en éloigne.
 */
export interface CanopProgressBarSingleProps extends ProgressBarCommonProps {
  value?: number;
  showValue?: boolean;
  segments?: never;
  max?: never;
}

/** Barre segmentée : chaque `value` est une part de `max`, ou de leur somme. */
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
