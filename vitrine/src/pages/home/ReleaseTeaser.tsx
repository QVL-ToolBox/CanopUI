import Box from "@mui/material/Box";
import { Card, Heading, Icon, Stack, StatusChip, Text } from "@canop/ui";
import { releaseHighlights } from "../../changelog/releaseHighlights";
import { formatReleaseDate } from "../../changelog/releaseDate";
import { releases, statusOf } from "../../changelog/releases";
import { navigateTo } from "../../router/routes";
import { useDocLocale } from "../../i18n/useDocLocale";

const fr = {
  upcoming: "Prochaine version",
  published: "Dernière version",
  status: { upcoming: "À paraître", current: "En production", past: "Antérieure" },
  entries: "changements",
  link: "Voir les notes de version",
};

const en: typeof fr = {
  upcoming: "Next release",
  published: "Latest release",
  status: { upcoming: "Upcoming", current: "In production", past: "Previous" },
  entries: "changes",
  link: "See the release notes",
};

const texts = { fr, en };

const RELEASES_PATH = "/docs/versions";

export function ReleaseTeaser() {
  const locale = useDocLocale();
  const t = texts[locale];
  const release = releases[0];
  if (!release) return null;

  const status = statusOf(release);
  const highlights = releaseHighlights(release);

  return (
    <Box
      sx={{
        maxWidth: "38rem",
        width: "100%",
        marginX: "auto",
      }}
    >
      <Card variant="interactive" onClick={() => navigateTo(RELEASES_PATH)} ariaLabel={t.link}>
        <Stack gap="sm">
          <Stack direction="row" alignItems="center" gap="sm" wrap>
            <Text variant="overline" weight="bold" tone="accent">
              {status === "upcoming" ? t.upcoming : t.published}
            </Text>
            <StatusChip
              tone={status === "upcoming" ? "warning" : "success"}
              label={t.status[status]}
            />
            <Box
              sx={{
                marginLeft: "auto",
              }}
            >
              <Text variant="caption" tone="subtle">
                {formatReleaseDate(release.date, locale)} · {release.entryCount} {t.entries}
              </Text>
            </Box>
          </Stack>
          <Heading level={2} size={4} gutterBottom={false}>
            CanopUI {release.version}
          </Heading>
          <Stack gap="xs">
            {highlights.map((highlight) => (
              <Stack key={highlight} direction="row" alignItems="baseline" gap="xs">
                <Icon name="caretRight" size="xs" color="accent" />
                <Text variant="body-sm" tone="muted">
                  {highlight}
                </Text>
              </Stack>
            ))}
          </Stack>
          <Stack direction="row" alignItems="center" gap="xs">
            <Text variant="label" tone="primary">
              {t.link}
            </Text>
            <Icon name="caretRight" size="xs" color="primary" />
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
