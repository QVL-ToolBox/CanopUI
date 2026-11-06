export function foldCaseAndAccents(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function foldForSearch(text: string): string {
  return foldCaseAndAccents(text)
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}
