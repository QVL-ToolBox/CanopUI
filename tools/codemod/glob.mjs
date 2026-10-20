/**
 * Conversion glob -> RegExp, suffisante pour les motifs d'exclusion usuels
 * (`**\/node_modules/**`, `*.test.ts`, ...).
 *
 * Ecrite en parseur caractere par caractere plutot qu'en cascade de `replace`
 * a base de sentinelles : c'est plus long, mais il n'y a aucun risque qu'un
 * marqueur intermediaire collisionne avec le contenu du motif.
 */

const REGEXP_SPECIALS = new Set([".", "+", "^", "$", "{", "}", "(", ")", "|", "[", "]", "\\"]);

export function globToRegExp(glob) {
  const source = String(glob);
  let out = "";
  let i = 0;

  while (i < source.length) {
    const char = source[i];

    if (char === "*") {
      const isDoubleStar = source[i + 1] === "*";
      if (isDoubleStar) {
        const followedBySlash = source[i + 2] === "/";
        // `**/` traverse zero ou plusieurs segments ; `**` en fin de motif
        // absorbe tout le reste du chemin.
        out += followedBySlash ? "(?:[^/]*/)*" : ".*";
        i += followedBySlash ? 3 : 2;
        continue;
      }
      // `*` simple ne franchit jamais un separateur.
      out += "[^/]*";
      i += 1;
      continue;
    }

    if (char === "?") {
      out += "[^/]";
      i += 1;
      continue;
    }

    out += REGEXP_SPECIALS.has(char) ? "\\" + char : char;
    i += 1;
  }

  return new RegExp("^" + out + "$");
}

/** Construit un predicat "ce chemin POSIX est-il exclu ?" a partir de globs. */
export function buildIgnoreMatcher(globs) {
  const patterns = globs.map(globToRegExp);
  return (posixPath) => patterns.some((pattern) => pattern.test(posixPath));
}
