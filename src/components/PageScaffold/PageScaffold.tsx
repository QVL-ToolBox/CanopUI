import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "../../i18n";
import { SeasonalBackdrop } from "../HalloweenDecor/SeasonalBackdrop";
import { Link } from "../Link";
import {
  Navbar,
  type CanopMobileFooterPlacement,
  type CanopNavbarItem,
  type CanopNavbarTitleLevel,
} from "../Navbar";
import { bleedThroughPageBottom } from "../_shared/pageBottomInset";
import { PageBackdrop, type CanopPageBackground } from "./PageBackdrop";
import { PageHeader } from "./PageHeader";
import { usePageScaffold, type CanopActionsPlacement } from "./usePageScaffold";

export type { CanopPageBackground, CanopActionsPlacement };

export interface CanopPageScaffoldProps {
  title?: string;
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
  mobileFooterPlacement?: CanopMobileFooterPlacement;
  actionsPlacement?: CanopActionsPlacement;
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
  mobileFooterPlacement = "floating",
  actionsPlacement = "header",
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
        <PageBackdrop background={background} />
        <SeasonalBackdrop />
        <motion.div
          initial={enter.container.initial}
          animate={enter.container.animate}
          variants={enter.container.variants}
          style={foregroundStyle}
        >
          <motion.div variants={enter.item.variants} style={headerItemStyle}>
            <PageHeader
              title={title}
              context={pageContext}
              subtitle={subtitle}
              actions={inlineActions}
              compact={isMobile}
            />
          </motion.div>
          <motion.div variants={enter.item.variants} style={contentItemStyle}>
            {children}
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
