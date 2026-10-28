import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { foldCaseAndAccents } from "../_shared/foldText";
import { firstCompletionIn, matchCompletion, prepareCandidate } from "./completionMatch";
import type {
  CanopCompletionResolver,
  CanopCompletionSource,
  CompletionMatch,
  CompletionNormalizer,
} from "./inlineCompletionTypes";

type Resolution = string | undefined;

function isPromiseLike(
  result: Resolution | PromiseLike<Resolution>,
): result is PromiseLike<Resolution> {
  return typeof result === "object" && typeof result.then === "function";
}

function resolverOf(
  source: CanopCompletionSource | undefined,
): CanopCompletionResolver | undefined {
  return typeof source === "function" ? source : undefined;
}

function candidatesOf(source: CanopCompletionSource | undefined): readonly string[] | undefined {
  return typeof source === "function" ? undefined : source;
}

function requestResolution(
  resolve: CanopCompletionResolver,
  value: string,
  signal: AbortSignal,
  settle: (next: Resolution) => void,
): void {
  try {
    const result = resolve(value, signal);
    if (isPromiseLike(result)) result.then(settle, () => settle(undefined));
    else settle(result);
  } catch {
    settle(undefined);
  }
}

export function useCompletionCandidate(
  value: string,
  source: CanopCompletionSource | undefined,
  normalize: CompletionNormalizer = foldCaseAndAccents,
): CompletionMatch | undefined {
  const resolver = resolverOf(source);
  const candidates = candidatesOf(source);
  const hasResolver = resolver !== undefined;
  const resolverRef = useRef(resolver);
  const [resolved, setResolved] = useState<Resolution>(undefined);

  useLayoutEffect(() => {
    resolverRef.current = resolver;
  });

  const prepared = useMemo(
    () => candidates?.map((candidate) => prepareCandidate(candidate, normalize)),
    [candidates, normalize],
  );

  useLayoutEffect(() => {
    const resolve = resolverRef.current;
    if (!hasResolver || !resolve || value === "") return;
    const controller = new AbortController();
    requestResolution(resolve, value, controller.signal, (next) => {
      if (!controller.signal.aborted) setResolved(next);
    });
    return () => controller.abort();
  }, [value, hasResolver]);

  return useMemo(() => {
    if (prepared) return firstCompletionIn(prepared, value, normalize);
    if (typeof resolved !== "string") return undefined;
    return matchCompletion(value, prepareCandidate(resolved, normalize), normalize);
  }, [prepared, resolved, value, normalize]);
}
