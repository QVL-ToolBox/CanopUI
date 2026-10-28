import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "../../i18n";
import { Link } from "../Link";
import {
  Navbar,
  type CanopMobileFooterPlacement,
  type CanopNavbarItem,
  type CanopNavbarTitleLevel,
} from "../Navbar";
import type { CanopBackgroundTone } from "../_shared/backgroundTone";
import type { CanopMainElement } from "../_shared/mainElement";
import { bleedThroughPageBottom } from "../_shared/pageBottomInset";
import type { CanopTitleLevel } from "../_shared/titleLevel";
import { PageBackdrop, type CanopPageBackground } from "./PageBackdrop";
import { PageHeader } from "./PageHeader";
import { PageSeasonalBackdrop } from "./PageSeasonalBackdrop";
import { RouteBoundary } from "./RouteBoundary";
import { usePageScaffold, type CanopActionsPlacement } from "./usePageScaffold";

export type { CanopPageBackground, CanopActionsPlacement };

export interface CanopPageScaffoldProps {
  title?: string;
  titleLevel?: CanopTitleLevel;
  subtitle?: string;
  headerActions?: ReactNode;
  navbarTitle?: string;
  navbarTitleLevel?: CanopNavbarTitleLevel;
  items: CanopNavbarItem[];
  activeHref?: string;
  onNavigate?: (href: string) => void;
  userName?: string;
  onLogout?: () => void;
  footer?: ReactNode;
  settingsFooter?: ReactNode;
  sidebarWidget?: ReactNode;
  infoHref?: string;
  supportHref?: string;
  height?: string;
  background?: CanopPageBackground;
  backgroundTone?: CanopBackgroundTone;
  mobileFooterPlacement?: CanopMobileFooterPlacement;
  actionsPlacement?: CanopActionsPlacement;
  mainElement?: CanopMainElement;
  /**
   * Pose une frontière Suspense qui montre un squelette de page pendant qu'une route lazy charge.
   * Changer la valeur en cours de vie remonte tout le contenu : l'état local des enfants est perdu.
   */
  skeleton?: boolean;
  children: ReactNode;
}

const footerPaddingX = { xs: "0.75rem", md: "2.5rem" };

const foregroundStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const headerItemStyle: CSSProperties = { flexShrink: 0 };

const contentItemStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export function PageScaffold({
  title,
  titleLevel,
  subtitle,
  headerActions,
  navbarTitle,
  navbarTitleLevel,
  items,
  activeHref,
  onNavigate,
  userName,
  onLogout,
  footer,
  settingsFooter,
  sidebarWidget,
  infoHref,
  supportHref,
  height,
  background = "canopy",
  backgroundTone = "primary",
  mobileFooterPlacement = "floating",
  actionsPlacement = "header",
  mainElement,
  skeleton = true,
  children,
}: CanopPageScaffoldProps) {
  const { isMobile, pageContext, inlineActions, floatingActions, enter } = usePageScaffold({
    items,
    activeHref,
    headerActions,
    actionsPlacement,
  });
  const { t } = useTranslation();

  return (
    <Navbar
      items={items}
      title={navbarTitle}
      titleLevel={navbarTitleLevel}
      activeHref={activeHref}
      onNavigate={onNavigate}
      userName={userName}
      onLogout={onLogout}
      footer={footer}
      settingsFooter={settingsFooter}
      sidebarWidget={sidebarWidget}
      actions={floatingActions}
      infoHref={infoHref}
      supportHref={supportHref}
      height={height}
      mobileFooterPlacement={mobileFooterPlacement}
      mainElement={mainElement}
    >
      <Box
        sx={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          ...bleedThroughPageBottom(),
        }}
      >
        <PageBackdrop background={background} tone={backgroundTone} />
        <PageSeasonalBackdrop />
        <motion.div
          initial={enter.container.initial}
          animate={enter.container.animate}
          variants={enter.container.variants}
          style={foregroundStyle}
        >
          <motion.div variants={enter.item.variants} style={headerItemStyle}>
            <PageHeader
              title={title}
              titleLevel={titleLevel}
              context={pageContext}
              subtitle={subtitle}
              actions={inlineActions}
              compact={isMobile}
            />
          </motion.div>
          <motion.div variants={enter.item.variants} style={contentItemStyle}>
            <RouteBoundary enabled={skeleton}>{children}</RouteBoundary>
          </motion.div>
          {!isMobile && (footer || supportHref) ? (
            <Box
              component="footer"
              sx={{
                flexShrink: 0,
                paddingX: footerPaddingX,
                paddingTop: "0.75rem",
                paddingBottom: "1rem",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                color: "text.secondary",
              }}
            >
              {footer}
              {supportHref ? (
                <Link href={supportHref} size="small" color="muted">
                  {t("canop.navbar.reportBug")}
                </Link>
              ) : null}
            </Box>
          ) : null}
        </motion.div>
      </Box>
    </Navbar>
  );
}
