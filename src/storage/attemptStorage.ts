export function attemptStorage(operation: () => void): void {
  try {
    operation();
  } catch {
    return;
  }
}
