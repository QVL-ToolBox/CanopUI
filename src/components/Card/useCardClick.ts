import { useCallback, useRef } from "react";
import type { KeyboardEvent, MouseEvent, SyntheticEvent } from "react";

export interface CardActionsIsolationProps {
  onClick?: (event: SyntheticEvent<HTMLDivElement>) => void;
  onKeyDown?: (event: SyntheticEvent<HTMLDivElement>) => void;
}

interface UseCardClickResult {
  handleClick: (event: MouseEvent<HTMLDivElement>) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  actionsProps: CardActionsIsolationProps;
}

const ACTIVATION_KEYS = new Set(["Enter", " "]);

export function useCardClick(onClick?: () => void): UseCardClickResult {
  const actionEvent = useRef<Event | null>(null);

  const markActionEvent = useCallback((event: SyntheticEvent<HTMLDivElement>) => {
    actionEvent.current = event.nativeEvent;
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!onClick || event.nativeEvent === actionEvent.current) return;
      onClick();
    },
    [onClick],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!onClick || event.nativeEvent === actionEvent.current) return;
      if (!ACTIVATION_KEYS.has(event.key)) return;
      event.preventDefault();
      onClick();
    },
    [onClick],
  );

  const actionsProps: CardActionsIsolationProps = onClick
    ? { onClick: markActionEvent, onKeyDown: markActionEvent }
    : {};

  return { handleClick, handleKeyDown, actionsProps };
}
