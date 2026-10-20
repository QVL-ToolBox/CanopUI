import { useCountdown } from "../../time";

/**
 * `"clock"` pour `1:00`, `"seconds"` pour `60`, `"auto"` pour laisser la durée
 * totale trancher.
 */
export type CanopCountdownFormat = "auto" | "clock" | "seconds";

export interface UseCountdownDisplayOptions {
  duration: number;
  running: boolean;
  format: CanopCountdownFormat;
  urgentBelow: number;
  beat: boolean;
  onEnd?: () => void;
}

export interface UseCountdownDisplayResult {
  seconds: number;
  text: string;
  percentage: number;
  urgent: boolean;
  beating: boolean;
  ended: boolean;
}

const CLOCK_THRESHOLD = 60_000;

function usesClockDecidedOnTotalDuration(format: CanopCountdownFormat, duration: number): boolean {
  if (format === "auto") return duration >= CLOCK_THRESHOLD;
  return format === "clock";
}

function formatSeconds(seconds: number, clock: boolean): string {
  if (!clock) return String(seconds);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function useCountdownDisplay({
  duration,
  running,
  format,
  urgentBelow,
  beat,
  onEnd,
}: UseCountdownDisplayOptions): UseCountdownDisplayResult {
  const { seconds, progress, ended } = useCountdown({ duration, running, onEnd });

  const urgent = urgentBelow > 0 && !ended && seconds <= urgentBelow;

  return {
    seconds,
    text: formatSeconds(seconds, usesClockDecidedOnTotalDuration(format, duration)),
    percentage: (1 - progress) * 100,
    urgent,
    beating: urgent && beat,
    ended,
  };
}
