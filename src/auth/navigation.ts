export function navigateTo(url: string): void {
  window.location.assign(url);
}

export const REDIRECT_INTENT_PARAM = "redirect";

export interface CanopLoginUrlOptions {
  authPortalUrl: string;
  loginPath?: string;
  redirectCookieName?: string;
  redirectCookieMaxAge?: number;
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
