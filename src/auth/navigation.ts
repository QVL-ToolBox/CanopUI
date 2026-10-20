export function navigateTo(url: string): void {
  window.location.assign(url);
}

export const REDIRECT_INTENT_PARAM = "redirect";

export interface CanopLoginUrlOptions {
  authPortalUrl: string;
  loginPath?: string;
  redirectCookieName?: string;
  redirectCookieMaxAge?: number;
  /**
   * Domaine du cookie de retour, par exemple `.qvl-project.com`.
   *
   * Sans lui, le cookie reste attache au sous-domaine qui l'ecrit, et le
   * portail d'authentification -- qui vit sur un autre sous-domaine en
   * production -- ne le lit pas : l'utilisateur se connecte puis atterrit sur
   * l'accueil au lieu de la page demandee. Vide en local, ou tout tient sur
   * `localhost`.
   */
  redirectCookieDomain?: string;
}

export function buildLoginUrl({
  authPortalUrl,
  loginPath = "/login",
  redirectCookieName = "ch_redirect",
  redirectCookieMaxAge = 300,
  redirectCookieDomain,
}: CanopLoginUrlOptions): string {
  const redirect = encodeURIComponent(window.location.href);
  const domaine = redirectCookieDomain ? `; domain=${redirectCookieDomain}` : "";
  const secureOnlyOnHttps = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${redirectCookieName}=${redirect}; path=/; max-age=${redirectCookieMaxAge}; SameSite=Lax${domaine}${secureOnlyOnHttps}`;
  const loginUrl = new URL(loginPath, authPortalUrl);
  loginUrl.searchParams.set(REDIRECT_INTENT_PARAM, "1");
  return loginUrl.toString();
}

export interface CanopCguUrlOptions {
  authPortalUrl: string;
  cguPath?: string;
  legalNoticeAnchor?: string;
}

export function buildCguUrl({
  authPortalUrl,
  cguPath = "/cgu",
  legalNoticeAnchor,
}: CanopCguUrlOptions): string {
  const cguUrl = new URL(cguPath, authPortalUrl);
  if (legalNoticeAnchor) {
    cguUrl.hash = legalNoticeAnchor;
  }
  return cguUrl.toString();
}
