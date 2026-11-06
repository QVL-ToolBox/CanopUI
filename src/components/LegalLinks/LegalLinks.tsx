import type { ReactNode } from "react";
import { Divider } from "../Divider";
import { Link } from "../Link";
import { Stack, type CanopStackDirection } from "../Stack";
import { useTranslation } from "../../i18n";
import { buildCguUrl } from "../../auth/navigation";

export const LEGAL_NOTICE_ANCHOR = "mentions-legales";

export interface CanopLegalLinksProps {
  authPortalUrl: string;
  cguPath?: string;
  direction?: CanopStackDirection;
  cguLabel?: string;
  noticeLabel?: string;
  ariaLabel?: string;
  renderLink?: (href: string, label: string) => ReactNode;
}

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
