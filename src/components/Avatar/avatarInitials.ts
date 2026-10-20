const WORD_SEPARATOR = /[\s\p{Pd}]+/u;
const FIRST_LETTER = /\p{L}\p{M}*/u;

function firstLetterOf(word: string): string | undefined {
  return FIRST_LETTER.exec(word)?.[0];
}

export function avatarInitials(name: string): string {
  const letters = name
    .normalize("NFC")
    .split(WORD_SEPARATOR)
    .map(firstLetterOf)
    .filter((letter): letter is string => letter !== undefined);
  const picked = letters.length > 1 ? [letters[0], letters[letters.length - 1]] : letters;
  return picked.map((letter) => letter.toLocaleUpperCase()).join("");
}
