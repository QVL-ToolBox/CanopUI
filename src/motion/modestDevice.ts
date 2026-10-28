const MODEST_CORES = 2;
const MODEST_MEMORY_GB = 2;

function deviceMemory(): number | undefined {
  if (!("deviceMemory" in navigator)) return undefined;
  const memory = navigator.deviceMemory;
  return typeof memory === "number" ? memory : undefined;
}

export function isModestDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency;
  const memory = deviceMemory();
  return (
    (cores > 0 && cores <= MODEST_CORES) || (memory !== undefined && memory <= MODEST_MEMORY_GB)
  );
}
