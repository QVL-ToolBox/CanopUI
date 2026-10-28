import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { useTranslation } from "../../i18n";
import {
  DIAL_SIZE,
  handAngle,
  handRadius,
  hourMarks,
  minuteMarks,
  timeAtPoint,
  type CanopClockMark,
} from "./clockGeometry";
import {
  DEFAULT_MINUTE_STEP,
  formatTime,
  formatUnit,
  HOURS_PER_DAY,
  MINUTES_PER_HOUR,
  normalizeStep,
  parseTime,
  shiftTime,
  snapMinutes,
  type CanopClockMode,
  type CanopTime,
} from "./clockTime";
import { useClockRotation } from "./useClockRotation";

export interface UseClockParams {
  value: string;
  onChange: (value: string) => void;
  minuteStep?: number;
  onComplete?: () => void;
  autoFocus?: boolean;
}

export interface UseClockDialProps {
  ref: (node: SVGSVGElement | null) => void;
  tabIndex: number;
  role: "slider";
  "aria-label": string;
  "aria-valuemin": number;
  "aria-valuemax": number;
  "aria-valuenow": number;
  "aria-valuetext": string;
  onKeyDown: (event: KeyboardEvent<SVGSVGElement>) => void;
  onPointerDown: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerMove: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerUp: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerCancel: () => void;
}

export interface UseClockResult {
  mode: CanopClockMode;
  showHours: () => void;
  showMinutes: () => void;
  hoursText: string;
  minutesText: string;
  hoursLabel: string;
  minutesLabel: string;
  hasValue: boolean;
  marks: CanopClockMark[];
  selectedValue: number;
  rotation: number;
  handLength: number;
  dialProps: UseClockDialProps;
}

const PLACEHOLDER = "--";

function currentTime(step: number): CanopTime {
  const now = new Date();
  return { hours: now.getHours(), minutes: snapMinutes(now.getMinutes(), step) };
}

function keyboardShift(key: string, mode: CanopClockMode, step: number): number | null {
  const unit = mode === "hours" ? 1 : step;
  switch (key) {
    case "ArrowUp":
    case "ArrowRight":
      return unit;
    case "ArrowDown":
    case "ArrowLeft":
      return -unit;
    case "PageUp":
      return mode === "hours" ? 3 : 15;
    case "PageDown":
      return mode === "hours" ? -3 : -15;
    default:
      return null;
  }
}

export function useClock({
  value,
  onChange,
  minuteStep = DEFAULT_MINUTE_STEP,
  onComplete,
  autoFocus = false,
}: UseClockParams): UseClockResult {
  const { t } = useTranslation();
  const step = normalizeStep(minuteStep);
  const parsed = parseTime(value);
  const [fallback] = useState(() => currentTime(step));
  const time = parsed ?? fallback;
  const [mode, setMode] = useState<CanopClockMode>("hours");
  const dragging = useRef(false);
  const dialNode = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (autoFocus) dialNode.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  const emit = useCallback(
    (next: CanopTime) => {
      if (parsed && next.hours === parsed.hours && next.minutes === parsed.minutes) return;
      onChange(formatTime(next));
    },
    [parsed, onChange],
  );

  const finishStep = useCallback(() => {
    if (mode === "hours") {
      setMode("minutes");
      return;
    }
    onComplete?.();
  }, [mode, onComplete]);

  const pickAt = useCallback(
    (event: PointerEvent<SVGSVGElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = ((event.clientX - rect.left) / rect.width) * DIAL_SIZE;
      const y = ((event.clientY - rect.top) / rect.height) * DIAL_SIZE;
      emit(timeAtPoint(x, y, mode, time, step));
    },
    [emit, mode, time, step],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<SVGSVGElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!parsed) emit(time);
        finishStep();
        return;
      }
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        const last = mode === "hours" ? HOURS_PER_DAY - 1 : MINUTES_PER_HOUR - step;
        const target = event.key === "Home" ? 0 : last;
        emit(mode === "hours" ? { ...time, hours: target } : { ...time, minutes: target });
        return;
      }
      const shift = keyboardShift(event.key, mode, step);
      if (shift === null) return;
      event.preventDefault();
      const aligned =
        mode === "minutes" ? { ...time, minutes: snapMinutes(time.minutes, step) } : time;
      emit(shiftTime(aligned, mode, shift));
    },
    [emit, finishStep, mode, parsed, step, time],
  );

  const marks = useMemo(() => (mode === "hours" ? hourMarks() : minuteMarks()), [mode]);
  const rotation = useClockRotation(handAngle(time, mode));
  const selectedValue = mode === "hours" ? time.hours : time.minutes;
  const unitKey = mode === "hours" ? "canop.clock.hoursValue" : "canop.clock.minutesValue";

  const dialRef = useCallback((node: SVGSVGElement | null) => {
    dialNode.current = node;
  }, []);

  return {
    mode,
    showHours: () => setMode("hours"),
    showMinutes: () => setMode("minutes"),
    hoursText: parsed ? formatUnit(parsed.hours) : PLACEHOLDER,
    minutesText: parsed ? formatUnit(parsed.minutes) : PLACEHOLDER,
    hoursLabel: t("canop.clock.hours"),
    minutesLabel: t("canop.clock.minutes"),
    hasValue: parsed !== null,
    marks,
    selectedValue,
    rotation,
    handLength: handRadius(time, mode),
    dialProps: {
      ref: dialRef,
      tabIndex: 0,
      role: "slider",
      "aria-label": t(mode === "hours" ? "canop.clock.hoursDial" : "canop.clock.minutesDial"),
      "aria-valuemin": 0,
      "aria-valuemax": mode === "hours" ? HOURS_PER_DAY - 1 : MINUTES_PER_HOUR - 1,
      "aria-valuenow": selectedValue,
      "aria-valuetext": t(unitKey, { value: selectedValue }),
      onKeyDown: handleKeyDown,
      onPointerDown: (event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        pickAt(event);
      },
      onPointerMove: (event) => {
        if (dragging.current) pickAt(event);
      },
      onPointerUp: (event) => {
        if (!dragging.current) return;
        dragging.current = false;
        pickAt(event);
        finishStep();
      },
      onPointerCancel: () => {
        dragging.current = false;
      },
    },
  };
}
