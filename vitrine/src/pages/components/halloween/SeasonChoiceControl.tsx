import { SegmentedControl } from "@canop/ui";
import { useSeasonChoiceControl, type SeasonChoiceLabels } from "./useSeasonChoiceControl";

export interface SeasonChoiceControlProps {
  ariaLabel: string;
  labels: SeasonChoiceLabels;
}

export function SeasonChoiceControl({ ariaLabel, labels }: SeasonChoiceControlProps) {
  const { choice, options, choose } = useSeasonChoiceControl(labels);

  return (
    <SegmentedControl value={choice} onChange={choose} options={options} ariaLabel={ariaLabel} />
  );
}
