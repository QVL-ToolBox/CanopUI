import { CanopApiError } from "./ApiError";

/**
 * Vrai lorsque l'erreur est un refus d'authentification, c'est-a-dire un 401.
 *
 * `RouteGuard` reclame ce predicat en parametre, si bien que chaque portail
 * l'ecrivait a l'identique -- trois copies de `error instanceof ApiError &&
 * error.status === 401` dans la flotte. Le fournir ici evite surtout qu'une
 * copie derive : un `catch` qui traiterait un 403 comme un 401 renverrait vers
 * la connexion un utilisateur deja connecte, donc en boucle.
 *
 * Une erreur qui n'est pas une `CanopApiError` -- une coupure reseau, par
 * exemple -- n'est pas un refus : elle doit remonter comme une panne, pas
 * declencher une reconnexion.
 */
export function isUnauthorized(error: unknown): boolean {
  return error instanceof CanopApiError && error.status === 401;
}

/** Vrai lorsque l'erreur est un refus d'autorisation, c'est-a-dire un 403. */
export function isForbidden(error: unknown): boolean {
  return error instanceof CanopApiError && error.status === 403;
}
