import { CANOP_VERSION } from "@canop/ui";
import source from "../../../CHANGELOG.md?raw";
import {
  parseChangelog,
  releaseStatus,
  type ChangelogRelease,
  type ChangelogReleaseStatus,
} from "./parseChangelog";

export const releases: ChangelogRelease[] = parseChangelog(source);

export const publishedVersion = CANOP_VERSION;

const publishedIndex = releases.findIndex(
  (release) => releaseStatus(release.version, publishedVersion) === "current",
);

export function statusOf(release: ChangelogRelease): ChangelogReleaseStatus {
  const index = releases.indexOf(release);
  if (publishedIndex === -1 || index === -1) {
    return releaseStatus(release.version, publishedVersion);
  }
  if (index === publishedIndex) return "current";
  return index < publishedIndex ? "upcoming" : "past";
}

export const upcomingReleases = releases.filter((release) => statusOf(release) === "upcoming");

export const publishedRelease = releases.find((release) => statusOf(release) === "current");

export const documentedEntries = releases.reduce((total, release) => total + release.entryCount, 0);
