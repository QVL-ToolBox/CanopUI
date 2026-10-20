import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import {
  Card,
  Heading,
  Icon,
  Stack,
  StatusChip,
  Text,
  type CanopStatusTone,
  type CanopTextTone,
} from "@canop/ui";
import { ChangelogBlocks } from "../../changelog/ChangelogBlocks";
import {
  releaseAnchorId,
  type ChangelogRelease,
  type ChangelogReleaseStatus,
} from "../../changelog/parseChangelog";
import { formatReleaseDate } from "../../changelog/releaseDate";
import type { DocLocale } from "../../i18n/useDocLocale";

const sectionTones: Record<string, CanopTextTone> = {
  Ajouté: "success",
  Modifié: "warning",
  Corrigé: "info",
  Supprimé: "error",
  Vitrine: "secondary",
  Migration: "accent",
};

const statusTones: Record<ChangelogReleaseStatus, CanopStatusTone> = {
  upcoming: "warning",
  current: "success",
  past: "neutral",
};

export interface ReleaseCardLabels {
  status: string;
  entries: string;
  toggle: string;
}

export interface ReleaseCardProps {
  release: ChangelogRelease;
  status: ChangelogReleaseStatus;
  locale: DocLocale;
  labels: ReleaseCardLabels;
  open: boolean;
  onToggle: () => void;
}

export function ReleaseCard({ release, status, locale, labels, open, onToggle }: ReleaseCardProps) {
  const anchor = releaseAnchorId(release.version);
  const panelId = `${anchor}-panel`;

  return (
    <Box id={anchor} sx={{ scrollMarginTop: "5.5rem" }}>
      <Card variant="surface" elevation={status === "past" ? "none" : "sm"}>
        <Stack gap="md">
          <Box
            component="button"
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${labels.toggle} ${release.version}`}
            sx={{
              appearance: "none",
              background: "none",
              border: "none",
              padding: 0,
              width: "100%",
              cursor: "pointer",
              color: "inherit",
              font: "inherit",
              textAlign: "left",
            }}
          >
            <Stack direction="row" alignItems="center" gap="sm" wrap>
              <Heading level={2} size={4} gutterBottom={false}>
                {release.version}
              </Heading>
              <StatusChip tone={statusTones[status]} label={labels.status} />
              <Box
                sx={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Text variant="caption" tone="subtle">
                  {formatReleaseDate(release.date, locale)} · {release.entryCount} {labels.entries}
                </Text>
                <Box
                  sx={{
                    display: "flex",
                    transform: open ? "rotate(180deg)" : "none",
                    transition: "transform 160ms ease",
                  }}
                >
                  <Icon name="caretDown" size="sm" color="inherit" />
                </Box>
              </Box>
            </Stack>
          </Box>
          <Collapse in={open} unmountOnExit id={panelId}>
            <Stack gap="lg">
              {release.intro.length > 0 ? <ChangelogBlocks blocks={release.intro} /> : null}
              {release.sections.map((section) => (
                <Stack key={section.title} gap="sm">
                  <Stack direction="row" alignItems="baseline" gap="sm">
                    <Text variant="overline" weight="bold" tone={sectionTones[section.title]}>
                      {section.title}
                    </Text>
                    {section.entryCount > 0 ? (
                      <Text variant="caption" tone="subtle">
                        {section.entryCount}
                      </Text>
                    ) : null}
                  </Stack>
                  <ChangelogBlocks blocks={section.blocks} />
                </Stack>
              ))}
            </Stack>
          </Collapse>
        </Stack>
      </Card>
    </Box>
  );
}
