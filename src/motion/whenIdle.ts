export interface WhenIdleOptions {
  timeout: number;
  fallbackDelay: number;
}

export function whenIdle(
  task: () => void,
  { timeout, fallbackDelay }: WhenIdleOptions,
): () => void {
  if (typeof requestIdleCallback === "function") {
    const handle = requestIdleCallback(() => task(), { timeout });
    return () => cancelIdleCallback(handle);
  }
  const handle = setTimeout(task, fallbackDelay);
  return () => clearTimeout(handle);
}
