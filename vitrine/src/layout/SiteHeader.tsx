import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  CANOP_VERSION,
  Icon,
  LanguageSelector,
  SettingsMenu,
  SidePanel,
  squircleClip,
  StatusChip,
  ThemeToggle,
  tokens,
} from "@canop/ui";
import { NavTree } from "./NavTree";
import { useSiteHeader } from "./useSiteHeader";
import { routeHref } from "../router/routes";
import { useDocLocale } from "../i18n/useDocLocale";

const labels = {
  fr: {
    home: "Accueil",
    gettingStarted: "Prise en main",
    components: "Composants",
    releases: "Notes de version",
    openNav: "Ouvrir la navigation",
  },
  en: {
    home: "Home",
    gettingStarted: "Getting started",
    components: "Components",
    releases: "Release notes",
    openNav: "Open navigation",
  },
};

const RELEASES_PATH = "/docs/versions";

interface HeaderLinkProps {
  path: string;
  label: string;
  active: boolean;
}

function HeaderLink({ path, label, active }: HeaderLinkProps) {
  return (
    <Box
      component="a"
      href={routeHref(path)}
      sx={{
        padding: "0.375rem 0.75rem",
        fontSize: "0.95rem",
        fontWeight: 500,
        color: active ? "primary.main" : "text.secondary",
        ...squircleClip(tokens.radius.sm),
        textDecoration: "none",
        transition: "color 160ms ease, background-color 160ms ease",

        "&:hover": {
          color: "text.primary",
          backgroundColor: "color-mix(in srgb, var(--canop-palette-text-primary) 6%, transparent)",
        },
      }}
    >
      {label}
    </Box>
  );
}

export interface SiteHeaderProps {
  activePath: string;
}

export function SiteHeader({ activePath }: SiteHeaderProps) {
  const { menuOpen, openMenu, closeMenu } = useSiteHeader();
  const t = labels[useDocLocale()];

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          height: "4.25rem",
          display: "flex",
          alignItems: "center",
          paddingX: { xs: "1rem", md: "2rem" },
          borderBottom: "0.0625rem solid",
          borderColor: "divider",
          zIndex: (theme) => theme.zIndex.appBar,

          backgroundColor:
            "color-mix(in srgb, var(--canop-palette-background-paper) 84%, transparent)",

          backdropFilter: "blur(0.5rem)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flex: 1,
            minWidth: 0,
          }}
        >
          <IconButton
            onClick={openMenu}
            aria-label={t.openNav}
            sx={{ display: { xs: "inline-flex", md: "none" }, color: "text.primary" }}
          >
            <Icon name="menu" size="md" />
          </IconButton>
          <Box
            component="a"
            href={routeHref("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <Icon name="apps" variant="solid" size="md" color="primary" />
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "text.primary",
              }}
            >
              Canop
              <Box
                component="span"
                sx={{
                  color: "primary.main",
                }}
              >
                UI
              </Box>
            </Typography>
          </Box>
          <StatusChip label={`v${CANOP_VERSION}`} tone="success" />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <HeaderLink path="/" label={t.home} active={activePath === "/"} />
            <HeaderLink
              path="/docs/installation"
              label={t.gettingStarted}
              active={activePath.startsWith("/docs") && activePath !== RELEASES_PATH}
            />
            <HeaderLink
              path="/components"
              label={t.components}
              active={activePath.startsWith("/components")}
            />
            <HeaderLink
              path={RELEASES_PATH}
              label={t.releases}
              active={activePath === RELEASES_PATH}
            />
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            <LanguageSelector />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <ThemeToggle />
      </Box>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        <SettingsMenu />
      </Box>
      <SidePanel open={menuOpen} onClose={closeMenu} title="CanopUI" width="18.75rem">
        <NavTree activePath={activePath} onNavigate={closeMenu} />
      </SidePanel>
    </>
  );
}
