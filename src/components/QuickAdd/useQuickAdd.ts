import {
  useCallback,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
  type RefObject,
} from "react";

export type CanopQuickAddOutcome = void | boolean;

export type CanopQuickAddHandler = (
  value: string,
) => CanopQuickAddOutcome | Promise<CanopQuickAddOutcome>;

export interface UseQuickAddParams {
  onAdd: CanopQuickAddHandler;
  disabled: boolean;
}

export interface UseQuickAddResult {
  draft: string;
  setDraft: (value: string) => void;
  canAdd: boolean;
  pending: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  keepFieldFocused: (event: MouseEvent<HTMLButtonElement>) => void;
}

function accepted(outcome: CanopQuickAddOutcome): boolean {
  return outcome !== false;
}

export function useQuickAdd({ onAdd, disabled }: UseQuickAddParams): UseQuickAddResult {
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const entry = draft.trim();
  const canAdd = !disabled && !pending && entry !== "";

  const focusField = useCallback(() => inputRef.current?.focus(), []);

  const settle = useCallback(
    (submitted: string, outcome: CanopQuickAddOutcome) => {
      if (accepted(outcome)) {
        setDraft((current) => (current === submitted ? "" : current));
      }
      focusField();
    },
    [focusField],
  );

  const finish = useCallback(
    (submitted: string, outcome: CanopQuickAddOutcome) => {
      setPending(false);
      settle(submitted, outcome);
    },
    [settle],
  );

  const awaitOutcome = useCallback(
    (submitted: string, outcome: Promise<CanopQuickAddOutcome>) => {
      setPending(true);
      outcome.then(
        (resolved) => finish(submitted, resolved),
        () => finish(submitted, false),
      );
    },
    [finish],
  );

  const add = useCallback(() => {
    if (!canAdd) return;
    const outcome = onAdd(entry);
    if (outcome instanceof Promise) {
      awaitOutcome(draft, outcome);
      return;
    }
    settle(draft, outcome);
  }, [awaitOutcome, canAdd, draft, entry, onAdd, settle]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      add();
    },
    [add],
  );

  const keepFieldFocused = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }, []);

  return {
    draft,
    setDraft,
    canAdd,
    pending,
    inputRef,
    handleSubmit,
    keepFieldFocused,
  };
}
