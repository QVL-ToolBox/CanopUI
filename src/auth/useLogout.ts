import { useCallback } from "react";
import { navigateTo } from "./navigation";

export interface UseLogoutParams {
  /** Appel qui invalide la session cote serveur. */
  logout: () => Promise<unknown>;
  /** URL vers laquelle partir ensuite, en general celle de la connexion. */
  loginUrl: () => string;
}

/**
 * La sequence de deconnexion : invalider la session, puis quitter la page,
 * **quoi qu'il arrive**.
 *
 * Le `finally` est le coeur de la chose et c'est ce qui etait recopie a
 * l'identique dans trois portails. Si l'appel echoue -- serveur muet, reseau
 * coupe, session deja expiree cote serveur -- il faut partir quand meme :
 * rester sur une page qui affiche encore le nom de l'utilisateur apres un clic
 * sur « se deconnecter » se lit comme un echec de deconnexion, alors que le
 * cookie est peut-etre deja mort. Un `await` sans garde laisserait
 * l'utilisateur sur place.
 */
export function useLogout({ logout, loginUrl }: UseLogoutParams): () => Promise<void> {
  return useCallback(async () => {
    try {
      await logout();
    } finally {
      navigateTo(loginUrl());
    }
  }, [logout, loginUrl]);
}
