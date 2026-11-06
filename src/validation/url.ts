export type CanopUrlKind = "http" | "relative" | "blocked";

export function classifyUrl(url: string): CanopUrlKind {
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:" ? "http" : "blocked";
  } catch {
    return "relative";
  }
}

export function isSafeUrl(url: string): boolean {
  return classifyUrl(url) !== "blocked";
}
