/**
 * Nature d'une URL du point de vue de la securite.
 *
 * `relative` n'est pas un echec : une URL sans schema est un chemin, que
 * l'application resoudra elle-meme. C'est `blocked` qui compte.
 */
export type CanopUrlKind = "http" | "relative" | "blocked";

/**
 * Classe une URL avant de l'ouvrir ou de la poser dans un attribut.
 *
 * Tout ce qui n'est ni `http:` ni `https:` est **bloque**, `javascript:` en
 * premier lieu : une URL de ce schema, placee dans un `href`, execute son
 * contenu au clic. Le cas se presente des qu'une application affiche des liens
 * qu'elle n'a pas ecrits -- du Markdown venu d'un depot, un champ rempli par un
 * utilisateur, une reponse d'API. `data:` et `blob:` sont bloques aussi : ils
 * permettent de servir une page entiere depuis l'attribut.
 *
 * Une URL malformee est traitee comme relative, pas comme sure : c'est a
 * l'appelant de la resoudre, et la resolution la fera passer par ce meme test.
 */
export function classifyUrl(url: string): CanopUrlKind {
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:" ? "http" : "blocked";
  } catch {
    return "relative";
  }
}

/**
 * Vrai lorsque l'URL peut etre suivie sans risque : une adresse http(s), ou un
 * chemin relatif. Faux pour tout schema executable.
 */
export function isSafeUrl(url: string): boolean {
  return classifyUrl(url) !== "blocked";
}
