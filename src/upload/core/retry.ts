import { CanopApiError } from "../../http";

export interface CanopRetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  signal?: AbortSignal;
}

function isRetryable(error: unknown): boolean {
  if (error instanceof CanopApiError) {
    return error.status >= 500 || error.status === 429;
  }
  return true;
}

function wait(delayMs: number, signal?: AbortSignal): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, delayMs);
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  { maxRetries, baseDelayMs, signal }: CanopRetryOptions,
): Promise<T> {
  let attempt = 0;
  for (;;) {
    if (signal?.aborted) {
      throw signal.reason;
    }
    try {
      return await operation();
    } catch (error) {
      if (signal?.aborted || attempt >= maxRetries || !isRetryable(error)) {
        throw error;
      }
      await wait(baseDelayMs * 2 ** attempt, signal);
      attempt += 1;
    }
  }
}
