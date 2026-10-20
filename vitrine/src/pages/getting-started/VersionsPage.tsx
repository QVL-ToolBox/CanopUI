import Box from "@mui/material/Box";
import { Button, CardGrid, Icon, Stack, StatCard, Text, squircleClip, tokens } from "@canop/ui";
import { DocPage } from "../../kit/DocPage";
import { DocSection } from "../../kit/DocSection";
import {
  documentedEntries,
  publishedRelease,
  publishedVersion,
  releases,
  statusOf,
  upcomingReleases,
} from "../../changelog/releases";
import type { ChangelogReleaseStatus } from "../../changelog/parseChangelog";
import { formatReleaseDate } from "../../changelog/releaseDate";
import { ReleaseCard } from "./ReleaseCard";
import { useVersionsPage } from "./useVersionsPage";
import { useDocLocale, type DocLocale } from "../../i18n/useDocLocale";

const fr = {
  intro:
    "Chaque version de CanopUI et ce qu'elle change. La page est générée depuis le CHANGELOG.md du dépôt : elle ne peut pas s'en écarter, et toute note ajoutée à la source apparaît ici sans intervention.",
  sections: {
    tracking: "Suivi",
    trackingDescription:
      "La version publiée est celle que servent les portails ; une version « à paraître » est documentée mais pas encore taguée.",
    summary: "Sommaire",
    summaryDescription: "Cliquez sur une version pour l'ouvrir et l'atteindre.",
    notes: "Notes de version",
    history: "Historique",
  },
  stats: {
    published: "Version publiée",
    upcoming: "À paraître",
    upcomingNone: "Aucune",
    documented: "Versions documentées",
    entries: "Changements listés",
  },
  status: {
    upcoming: "À paraître",
    current: "En production",
    past: "Antérieure",
  },
  entries: "changements",
  toggle: "Afficher ou masquer la version",
  expandAll: "Tout déplier",
  collapseAll: "Tout replier",
  lastPublished: "publiée le",
  inProgress: "en préparation",
};

const en: typeof fr = {
  intro:
    "Every CanopUI release and what it changes. The page is generated from the repository CHANGELOG.md: it cannot drift from it, and any note added to the source shows up here with no further work.",
  sections: {
    tracking: "Tracking",
    trackingDescription:
      "The published version is the one portals consume; an upcoming version is documented but not tagged yet.",
    summary: "Summary",
    summaryDescription: "Click a version to open it and jump to it.",
    notes: "Release notes",
    history: "History",
  },
  stats: {
    published: "Published version",
    upcoming: "Upcoming",
    upcomingNone: "None",
    documented: "Documented versions",
    entries: "Listed changes",
  },
  status: {
    upcoming: "Upcoming",
    current: "In production",
    past: "Previous",
  },
  entries: "changes",
  toggle: "Show or hide release",
  expandAll: "Expand all",
  collapseAll: "Collapse all",
  lastPublished: "published on",
  inProgress: "in preparation",
};

const texts = { fr, en };

const chipTint: Record<ChangelogReleaseStatus, string> = {
  upcoming: "var(--canop-palette-warning-main)",
  current: "var(--canop-palette-success-main)",
  past: "var(--canop-palette-text-primary)",
};

interface SummaryChipProps {
  version: string;
  status: ChangelogReleaseStatus;
  onSelect: () => void;
}

function SummaryChip({ version, status, onSelect }: SummaryChipProps) {
  const tint = chipTint[status];
  return (
    <Box
      component="button"
      type="button"
      onClick={onSelect}
      sx={{
        padding: "0.3rem 0.7rem",
        fontSize: "0.85rem",
        fontWeight: status === "past" ? 400 : 700,
        ...squircleClip(tokens.radius.xs),
        appearance: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        color: status === "past" ? "text.secondary" : tint,
        backgroundColor: `color-mix(in srgb, ${tint} 12%, transparent)`,
        transition: "background-color 160ms ease, color 160ms ease",

        "&:hover": {
          backgroundColor: `color-mix(in srgb, ${tint} 22%, transparent)`,
          color: status === "past" ? "text.primary" : tint,
        },
      }}
    >
      {version}
    </Box>
  );
}

function trackingCaption(locale: DocLocale, t: typeof fr): string {
  const parts: string[] = [];
  if (publishedRelease) {
    parts.push(
      `${publishedRelease.version} ${t.lastPublished} ${formatReleaseDate(publishedRelease.date, locale)}`,
    );
  }
  for (const release of upcomingReleases) {
    parts.push(`${release.version} ${t.inProgress} · ${release.entryCount} ${t.entries}`);
  }
  return parts.join(" — ");
}

export function VersionsPage() {
  const locale = useDocLocale();
  const t = texts[locale];
  const { isOpen, toggle, expandAll, collapseAll, focusRelease, allOpen } = useVersionsPage();
  const nextVersion = upcomingReleases[0];

  return (
    <DocPage title={t.sections.notes} intro={t.intro}>
      <DocSection title={t.sections.tracking} description={t.sections.trackingDescription}>
        <Stack gap="sm">
          <CardGrid minItemWidth="13rem" gap="sm">
            <StatCard
              label={t.stats.published}
              value={publishedVersion}
              icon="tag"
              iconColor="success"
            />
            <StatCard
              label={t.stats.upcoming}
              value={nextVersion ? nextVersion.version : t.stats.upcomingNone}
              icon="timer"
              iconColor="warning"
            />
            <StatCard
              label={t.stats.documented}
              value={String(releases.length)}
              icon="bookOpen"
              iconColor="primary"
            />
            <StatCard
              label={t.stats.entries}
              value={String(documentedEntries)}
              icon="barChart"
              iconColor="accent"
            />
          </CardGrid>
          <Text variant="caption" tone="subtle">
            {trackingCaption(locale, t)}
          </Text>
        </Stack>
      </DocSection>
      <DocSection title={t.sections.summary} description={t.sections.summaryDescription}>
        <Stack gap="sm">
          <Stack direction="row" gap="xs" wrap>
            {releases.map((release) => (
              <SummaryChip
                key={release.version}
                version={release.version}
                status={statusOf(release)}
                onSelect={() => focusRelease(release.version)}
              />
            ))}
          </Stack>
          <Stack direction="row" gap="sm" alignItems="center">
            <Button
              variant="ghost"
              size="small"
              startIcon={<Icon name={allOpen ? "sort" : "expand"} size="sm" color="inherit" />}
              onClick={allOpen ? collapseAll : expandAll}
            >
              {allOpen ? t.collapseAll : t.expandAll}
            </Button>
            <Text variant="caption" tone="subtle">
              {releases.length} · {documentedEntries} {t.entries}
            </Text>
          </Stack>
        </Stack>
      </DocSection>
      <DocSection title={t.sections.history}>
        <Stack gap="md">
          {releases.map((release) => {
            const status = statusOf(release);
            return (
              <ReleaseCard
                key={release.version}
                release={release}
                status={status}
                locale={locale}
                labels={{
                  status: t.status[status],
                  entries: t.entries,
                  toggle: t.toggle,
                }}
                open={isOpen(release.version)}
                onToggle={() => toggle(release.version)}
              />
            );
          })}
        </Stack>
      </DocSection>
    </DocPage>
  );
}
