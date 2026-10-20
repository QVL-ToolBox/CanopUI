const UNITS = ["o", "Kio", "Mio", "Gio", "Tio"] as const;

export function formatBytes(bytes: number): string {
  if (bytes <= 0) {
    return "0 o";
  }
  const exponent = Math.min(UNITS.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** exponent;
  const rounded = exponent === 0 ? value : Math.round(value * 10) / 10;
  return `${rounded} ${UNITS[exponent]}`;
}
