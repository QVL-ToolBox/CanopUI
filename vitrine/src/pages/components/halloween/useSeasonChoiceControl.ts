import type { CanopSegmentedControlOption } from "@canop/ui";
import { useSeasonChoice } from "../../../season/useSeasonChoice";
import type { VitrineSeasonChoice } from "../../../season/VitrineSeasonContext";

export type SeasonChoiceLabels = Record<VitrineSeasonChoice, string>;

export interface UseSeasonChoiceControlResult {
  choice: VitrineSeasonChoice;
  options: CanopSegmentedControlOption<VitrineSeasonChoice>[];
  choose: (choice: VitrineSeasonChoice) => void;
}

const CHOICE_ORDER: VitrineSeasonChoice[] = ["auto", "halloween", "off"];

export function useSeasonChoiceControl(labels: SeasonChoiceLabels): UseSeasonChoiceControlResult {
  const { choice, choose } = useSeasonChoice();
  const options = CHOICE_ORDER.map((value) => ({ value, label: labels[value] }));

  return { choice, options, choose };
}
