import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";

const DUREE_APPUI_LONG_MS = 500;
const TOLERANCE_AVANT_DEFILEMENT_PX = 10;
const COMMANDES_GARDANT_LEUR_GESTE = "button, a, input, label";
const TOUCHE_SELECTION = " ";

interface Params {
  enabled: boolean;
  onSelect: () => void;
}

interface GesteEvent {
  target: EventTarget | null;
  currentTarget: HTMLElement;
}

function doitIgnorer({ target, currentTarget }: GesteEvent): boolean {
  const cible = target as HTMLElement | null;
  if (!cible || !currentTarget.contains(cible)) return true;
  return Boolean(cible.closest(COMMANDES_GARDANT_LEUR_GESTE));
}

export interface LongPressHandlers {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onContextMenu: (event: { preventDefault: () => void }) => void;
  onKeyDownCapture: (event: KeyboardEvent<HTMLElement>) => void;
}

export interface UseLongPressSelectResult {
  handlers: LongPressHandlers;
  vientDeSelectionner: () => boolean;
}

export function useLongPressSelect({ enabled, onSelect }: Params): UseLongPressSelectResult {
  const minuterie = useRef<number | null>(null);
  const depart = useRef<{ x: number; y: number } | null>(null);
  const declenche = useRef(false);

  const annuler = useCallback(() => {
    if (minuterie.current !== null) {
      window.clearTimeout(minuterie.current);
      minuterie.current = null;
    }
    depart.current = null;
  }, []);

  useEffect(() => annuler, [annuler]);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!enabled || doitIgnorer(event)) return;
      declenche.current = false;
      depart.current = { x: event.clientX, y: event.clientY };
      minuterie.current = window.setTimeout(() => {
        declenche.current = true;
        minuterie.current = null;
        onSelect();
      }, DUREE_APPUI_LONG_MS);
    },
    [enabled, onSelect],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const origine = depart.current;
      if (!origine || minuterie.current === null) return;
      const ecart = Math.hypot(event.clientX - origine.x, event.clientY - origine.y);
      if (ecart > TOLERANCE_AVANT_DEFILEMENT_PX) annuler();
    },
    [annuler],
  );

  const onKeyDownCapture = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (!enabled || event.key !== TOUCHE_SELECTION || doitIgnorer(event)) return;
      event.preventDefault();
      event.stopPropagation();
      onSelect();
    },
    [enabled, onSelect],
  );

  return {
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: annuler,
      onPointerCancel: annuler,
      onKeyDownCapture,
      onContextMenu: function bloquerMenuSystemeApresAppuiLong(event) {
        if (enabled && declenche.current) event.preventDefault();
      },
    },
    vientDeSelectionner: () => {
      const oui = declenche.current;
      declenche.current = false;
      return oui;
    },
  };
}
