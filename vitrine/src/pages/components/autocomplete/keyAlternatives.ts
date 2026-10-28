const ALTERNATIVE_SEPARATOR = "/";
const COMBINATION_SEPARATOR = / \+ /g;
const UNBREAKABLE_PLUS = " + ";

export function keyAlternatives(keys: string): string[] {
  return keys
    .split(ALTERNATIVE_SEPARATOR)
    .map((alternative) => alternative.trim().replace(COMBINATION_SEPARATOR, UNBREAKABLE_PLUS))
    .filter((alternative) => alternative.length > 0);
}
