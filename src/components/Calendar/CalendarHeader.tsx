import IconButton from "@mui/material/IconButton";
import { Icon } from "../Icon";
import { Stack } from "../Stack";
import { Text } from "../Text";

export interface CalendarHeaderProps {
  title: string;
  titleId: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  previousLabel: string;
  nextLabel: string;
  onPrevious: () => void;
  onNext: () => void;
}

export function CalendarHeader({
  title,
  titleId,
  canGoPrevious,
  canGoNext,
  previousLabel,
  nextLabel,
  onPrevious,
  onNext,
}: CalendarHeaderProps) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap="xs">
      <IconButton
        aria-label={previousLabel}
        onClick={onPrevious}
        disabled={!canGoPrevious}
        size="small"
      >
        <Icon name="caretLeft" variant="outline" size="sm" color="inherit" />
      </IconButton>
      <span id={titleId} aria-live="polite">
        <Text variant="label" weight="semibold" align="center">
          {title}
        </Text>
      </span>
      <IconButton aria-label={nextLabel} onClick={onNext} disabled={!canGoNext} size="small">
        <Icon name="caretRight" variant="outline" size="sm" color="inherit" />
      </IconButton>
    </Stack>
  );
}
