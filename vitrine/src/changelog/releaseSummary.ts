import type { ChangelogRelease } from "./parseChangelog";
import { releaseHighlights } from "./releaseHighlights";

export interface LatestReleaseSummary {
  version: string;
  date: string;
  entryCount: number;
  highlights: string[];
}

export interface ReleaseSummary {
  history: string[];
  latest: LatestReleaseSummary | null;
}

export function summarizeReleases(releases: ChangelogRelease[]): ReleaseSummary {
  const [latest] = releases;
  return {
    history: releases.map((release) => release.version),
    latest: latest
      ? {
          version: latest.version,
          date: latest.date,
          entryCount: latest.entryCount,
          highlights: releaseHighlights(latest),
        }
      : null,
  };
}
