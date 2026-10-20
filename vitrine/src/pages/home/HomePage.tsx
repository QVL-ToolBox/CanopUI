import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, CANOP_VERSION, Divider, Heading, Icon, icons, Stack, StatusChip } from "@canop/ui";
import { useDocLocale } from "../../i18n/useDocLocale";
import { fadeUpSx } from "../../kit/motion";
import { navigateTo } from "../../router/routes";
import { FeatureGrid } from "./FeatureGrid";
import { HeroDemoCard } from "./HeroDemoCard";
import { ReleaseTeaser } from "./ReleaseTeaser";

interface Stat {
  value: string;
  label: string;
}

interface HomeTexts {
  versionChip: string;
  heroTitle: string;
  heroParagraph: string;
  start: string;
  explore: string;
  stats: Stat[];
  sectionTitle: string;
  footerTagline: string;
  footerVersion: string;
}

const iconCount = String(Object.keys(icons).length);

const fr: HomeTexts = {
  versionChip: `v${CANOP_VERSION} — disponible sur npm.qvl-project.com`,
  heroTitle: "Le design system de l'écosystème Studio.",
  heroParagraph:
    "CanopUI fournit des composants React élégants, accessibles et typés strictement, bâtis sur MUI et pensés pour le Module Federation. Concentrez-vous sur vos portails, la canopée s'occupe du reste.",
  start: "Commencer",
  explore: "Explorer les composants",
  stats: [
    { value: "40+", label: "composants" },
    { value: iconCount, label: "icônes" },
    { value: "2", label: "thèmes" },
    { value: "100%", label: "TypeScript" },
  ],
  sectionTitle: "Pensé pour les portails QVL",
  footerTagline: "CanopUI — design system QVL-Studio, bâti sur MUI.",
  footerVersion: `Version ${CANOP_VERSION} · Fork de CH-UI-Library v0.7.0`,
};

const en: typeof fr = {
  versionChip: `v${CANOP_VERSION} — available on npm.qvl-project.com`,
  heroTitle: "The design system for the Studio ecosystem.",
  heroParagraph:
    "CanopUI delivers elegant, accessible and strictly typed React components, built on MUI and designed for Module Federation. Focus on your portals, the canopy handles the rest.",
  start: "Get started",
  explore: "Explore components",
  stats: [
    { value: "40+", label: "components" },
    { value: iconCount, label: "icons" },
    { value: "2", label: "themes" },
    { value: "100%", label: "TypeScript" },
  ],
  sectionTitle: "Built for QVL portals",
  footerTagline: "CanopUI — QVL-Studio design system, built on MUI.",
  footerVersion: `Version ${CANOP_VERSION} · Fork of CH-UI-Library v0.7.0`,
};

const texts = { fr, en };

function HeroSection() {
  const t = texts[useDocLocale()];
  return (
    <Box
      sx={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--canop-palette-primary-main) 16%, transparent), transparent)",
      }}
    >
      <Box
        sx={{
          maxWidth: "72rem",
          marginX: "auto",
          paddingX: { xs: "1.25rem", md: "3rem" },
          paddingY: { xs: "3rem", md: "5rem" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: "3rem",
        }}
      >
        <Box
          sx={[
            {
              flex: 1,
            },
            fadeUpSx(),
          ]}
        >
          <Stack gap="lg">
            <Stack gap="sm">
              <Box>
                <StatusChip tone="success" label={t.versionChip} />
              </Box>
              <Heading level={1} size={2} gutterBottom={false}>
                {t.heroTitle}
              </Heading>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "1.2rem",
                  lineHeight: 1.6,
                }}
              >
                {t.heroParagraph}
              </Typography>
            </Stack>
            <Stack direction="row" gap="md" wrap>
              <Button
                variant="primary"
                size="large"
                onClick={() => navigateTo("/docs/installation")}
                endIcon={<Icon name="caretRight" size="xs" />}
              >
                {t.start}
              </Button>
              <Button variant="secondary" size="large" onClick={() => navigateTo("/components")}>
                {t.explore}
              </Button>
            </Stack>
          </Stack>
        </Box>
        <Box
          sx={[
            {
              width: { xs: "100%", md: "26rem" },
              flexShrink: 0,
            },
            fadeUpSx(160),
          ]}
        >
          <HeroDemoCard />
        </Box>
      </Box>
    </Box>
  );
}

function StatsStrip() {
  const t = texts[useDocLocale()];
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: { xs: "2rem", md: "4rem" },
        paddingY: "2.5rem",
      }}
    >
      {t.stats.map((stat) => (
        <Stack key={stat.label} alignItems="center" gap="xs">
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "2rem",
              color: "primary.main",
            }}
          >
            {stat.value}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "0.9rem",
            }}
          >
            {stat.label}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}

function HomeFooter() {
  const t = texts[useDocLocale()];
  return (
    <Box
      sx={{
        paddingY: "2rem",
        paddingX: { xs: "1.25rem", md: "3rem" },
      }}
    >
      <Stack alignItems="center" gap="xs">
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.85rem",
          }}
        >
          {t.footerTagline}
        </Typography>
        <Typography
          sx={{
            color: "text.disabled",
            fontSize: "0.8rem",
          }}
        >
          {t.footerVersion}
        </Typography>
      </Stack>
    </Box>
  );
}

export function HomePage() {
  const t = texts[useDocLocale()];
  return (
    <Box>
      <HeroSection />
      <Box
        sx={{
          maxWidth: "72rem",
          marginX: "auto",
          paddingX: { xs: "1.25rem", md: "3rem" },
        }}
      >
        <Stack gap="xl">
          <StatsStrip />
          <Box sx={fadeUpSx(240)}>
            <ReleaseTeaser />
          </Box>
          <Stack gap="md">
            <Heading level={2} size={4} align="center" gutterBottom={false}>
              {t.sectionTitle}
            </Heading>
            <FeatureGrid />
          </Stack>
          <Divider spacing="xl" />
        </Stack>
      </Box>
      <HomeFooter />
    </Box>
  );
}
