import { SINGLE_SHOT_THRESHOLD } from "./constants";
import type { CanopUploadStrategy } from "./types";

/**
 * Le seuil dépend du déploiement : c'est la plus grosse requête que la chaîne
 * (passerelle, reverse proxy, CDN) accepte de laisser passer d'un bloc. Un
 * appelant dont la passerelle plafonne plus bas que la valeur par défaut doit
 * pouvoir l'abaisser, sinon ses fichiers partent en un seul morceau et se font
 * refuser en 413.
 */
export function selectStrategy(
  declaredSize: number,
  threshold: number = SINGLE_SHOT_THRESHOLD,
): CanopUploadStrategy {
  return declaredSize < threshold ? "single-shot" : "chunked";
}
