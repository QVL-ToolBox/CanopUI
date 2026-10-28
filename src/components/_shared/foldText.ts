export function foldCaseAndAccents(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

/**
 * Ramène un texte à ce qui compte pour le comparer : sans accent, sans casse,
 * et **sans séparateurs**.
 *
 * Les deux premiers sont ce que fait n'importe quel filtre. Le troisième est
 * ce qui manque partout où les libellés sont des noms composés : « Côte-d'Or »
 * s'écrit `cote d or`, donc une saisie sans tiret ni apostrophe le trouve.
 * Personne ne tape « Seine-Saint-Denis » avec ses tirets dans un champ de
 * recherche, et un filtre qui les exige répond « inconnu » alors que la
 * suggestion est sous les yeux.
 *
 * Tout ce qui n'est ni lettre ni chiffre devient une espace, et les espaces
 * consécutives se réduisent à une seule : la ponctuation ne peut donc plus
 * faire échouer une comparaison, quelle qu'elle soit.
 */
export function foldForSearch(text: string): string {
  return foldCaseAndAccents(text)
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}
