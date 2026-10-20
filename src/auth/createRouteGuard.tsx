import type { ReactNode } from "react";
import { RouteGuard } from "./RouteGuard";
import type { UseRouteGuardParams } from "./useRouteGuard";

/**
 * Un libelle, ou une fonction qui le produit.
 *
 * La fonction est indispensable : `createRouteGuard` s'appelle **au niveau du
 * module**, hors de tout composant, la ou les hooks de traduction sont
 * illegaux. Un libelle donne en chaine ne peut donc pas etre traduit, et c'est
 * ce qui rendait la fabrique inutilisable des qu'un portail voulait des textes
 * dans la langue de l'utilisateur : les trois portails de la flotte
 * recomposaient `RouteGuard` a la main pour cette seule raison.
 */
export type CanopGuardLabel = string | (() => string);

export interface CanopCreateRouteGuardConfig<TUser> extends UseRouteGuardParams<TUser> {
  loadingLabel: CanopGuardLabel;
  errorLabel: CanopGuardLabel;
  renderForbidden: () => ReactNode;
  /**
   * Ce qu'on rend quand l'acces est accorde. A defaut, les `children` du
   * composant produit.
   *
   * Sert aux routes de mise en page d'un routeur, ou la garde n'a pas
   * d'enfants a elle et doit rendre la sortie du routeur -- un `<Outlet />`
   * avec React Router. La librairie n'a pas a connaitre le routeur : c'est le
   * portail qui passe la fonction.
   */
  renderAuthorized?: () => ReactNode;
}

function resolveLabelDuringRender(label: CanopGuardLabel): string {
  return typeof label === "function" ? label() : label;
}

export function createRouteGuard<TUser>({
  loadingLabel,
  errorLabel,
  renderAuthorized,
  ...config
}: CanopCreateRouteGuardConfig<TUser>) {
  return function GuardedRoute({ children }: { children?: ReactNode }) {
    return (
      <RouteGuard<TUser>
        {...config}
        loadingLabel={resolveLabelDuringRender(loadingLabel)}
        errorLabel={resolveLabelDuringRender(errorLabel)}
        renderAuthorized={renderAuthorized ?? (() => children)}
      />
    );
  };
}
