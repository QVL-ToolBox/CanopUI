import { CANOP_VERSION } from "@canop/ui";
import source from "../../../CHANGELOG.md?raw";
import {
  parseChangelog,
  releaseStatusInHistory,
  type ChangelogRelease,
  type ChangelogReleaseStatus,
} from "./parseChangelog";

export const releases: ChangelogRelease[] = parseChangelog(source);

export const publishedVersion = CANOP_VERSION;

const history = releases.map((release) => release.version);

export function statusOf(release: ChangelogRelease): ChangelogReleaseStatus {
  return releaseStatusInHistory(release.version, history, publishedVersion);
}

export const upcomingReleases = releases.filter((release) => statusOf(release) === "upcoming");

export const publishedRelease = releases.find((release) => statusOf(release) === "current");

export const documentedEntries = releases.reduce((total, release) => total + release.entryCount, 0);
