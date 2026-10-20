import type { ReactNode } from "react";
import { Divider } from "../Divider";
import { Link } from "../Link";
import { Stack, type CanopStackDirection } from "../Stack";
import { useTranslation } from "../../i18n";
import { buildCguUrl } from "../../auth/navigation";

/** L'ancre des mentions legales dans la page des conditions d'utilisation. */
export const LEGAL_NOTICE_ANCHOR = "mentions-legales";

export interface CanopLegalLinksProps {
  /** Origine du portail qui heberge les conditions, par exemple `https://auth.qvl-project.com`. */
  authPortalUrl: string;
  /** Chemin des conditions sur ce portail. */
  cguPath?: string;
  direction?: CanopStackDirection;
  cguLabel?: string;
  noticeLabel?: string;
  ariaLabel?: string;
  /**
   * Rend un lien autrement que par une adresse absolue.
   *
   * Sert au portail qui **heberge** lui-meme ces pages : il navigue en interne
   * par son routeur au lieu de recharger une URL. Sans cette porte, ce portail
   * ne pouvait pas partager le composant, et en gardait une copie a lui.
   */
  renderLink?: (href: string, label: string) => ReactNode;
}

/**
 * Le pied de page legal : conditions d'utilisation et mentions legales.
 *
 * Les deux pointent la meme page, les mentions legales n'etant qu'une ancre
 * dedans. Cette ancre vivait en dur dans chaque portail, ce qui la rendait
 * impossible a deplacer sans les visiter tous ; elle est desormais ici, et
 * exportee pour qui en a besoin ailleurs.
 */
export function LegalLinks({
  authPortalUrl,
  cguPath,
  direction = "row",
  cguLabel,
  noticeLabel,
  ariaLabel,
  renderLink,
}: CanopLegalLinksProps) {
  const { t } = useTranslation();
  const cgu = buildCguUrl({ authPortalUrl, cguPath });
  const notice = buildCguUrl({ authPortalUrl, cguPath, legalNoticeAnchor: LEGAL_NOTICE_ANCHOR });
  const libelleCgu = cguLabel ?? t("canop.legal.cgu");
  const libelleNotice = noticeLabel ?? t("canop.legal.notice");

  const lien = (href: string, label: string) =>
    renderLink?.(href, label) ?? (
      <Link href={href} size="small" color="secondary">
        {label}
      </Link>
    );

  return (
    <Stack
      as="nav"
      direction={direction}
      gap="xs"
      alignItems="center"
      ariaLabel={ariaLabel ?? t("canop.legal.footerLabel")}
    >
      {lien(cgu, libelleCgu)}
      <Divider
        orientation={direction === "row" ? "vertical" : "horizontal"}
        flexItem
        spacing="xs"
      />
      {lien(notice, libelleNotice)}
    </Stack>
  );
}
