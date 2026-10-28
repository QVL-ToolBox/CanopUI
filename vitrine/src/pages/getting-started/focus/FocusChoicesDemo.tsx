import {
  Checkbox,
  SegmentedControl,
  Slider,
  Stack,
  ThemeToggle,
  Toggle,
  type CanopSegmentedControlOption,
} from "@canop/ui";
import { FocusDemoSurface } from "./FocusDemoSurface";

export interface FocusChoicesLabels {
  group: string;
  view: string;
  grid: string;
  list: string;
  notifications: string;
  accept: string;
  volume: string;
}

export interface FocusChoicesDemoProps {
  labels: FocusChoicesLabels;
  view: string;
  onViewChange: (view: string) => void;
  notifications: boolean;
  onNotificationsChange: (enabled: boolean) => void;
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function FocusChoicesDemo({
  labels,
  view,
  onViewChange,
  notifications,
  onNotificationsChange,
  accepted,
  onAcceptedChange,
  volume,
  onVolumeChange,
}: FocusChoicesDemoProps) {
  const viewOptions: CanopSegmentedControlOption[] = [
    { value: "grid", label: labels.grid, icon: "apps" },
    { value: "list", label: labels.list, icon: "menu" },
  ];

  return (
    <FocusDemoSurface ariaLabel={labels.group} layout="stacked">
      <Stack direction="row" wrap gap="md" alignItems="center">
        <SegmentedControl
          options={viewOptions}
          value={view}
          onChange={onViewChange}
          ariaLabel={labels.view}
        />
        <Toggle
          checked={notifications}
          onChange={onNotificationsChange}
          label={labels.notifications}
        />
        <Checkbox checked={accepted} onChange={onAcceptedChange} label={labels.accept} />
        <ThemeToggle />
      </Stack>
      <Slider value={volume} onChange={onVolumeChange} label={labels.volume} showValue />
    </FocusDemoSurface>
  );
}
