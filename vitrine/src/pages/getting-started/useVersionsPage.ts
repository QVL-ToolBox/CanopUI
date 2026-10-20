import { useCallback, useState } from "react";
import { useReducedMotion } from "@canop/ui";
import { releaseAnchorId, type ChangelogRelease } from "../../changelog/parseChangelog";
import { releases, statusOf } from "../../changelog/releases";

function initiallyOpen(): string[] {
  const opened = releases
    .filter((release) => statusOf(release) !== "past")
    .map((release) => release.version);
  return opened.length > 0 ? opened : releases.slice(0, 1).map((release) => release.version);
}

export interface UseVersionsPageResult {
  releases: ChangelogRelease[];
  isOpen: (version: string) => boolean;
  toggle: (version: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  focusRelease: (version: string) => void;
  allOpen: boolean;
}

export function useVersionsPage(): UseVersionsPageResult {
  const [open, setOpen] = useState<string[]>(initiallyOpen);
  const reducedMotion = useReducedMotion();

  const isOpen = useCallback((version: string) => open.includes(version), [open]);

  const toggle = useCallback((version: string) => {
    setOpen((current) =>
      current.includes(version)
        ? current.filter((entry) => entry !== version)
        : [...current, version],
    );
  }, []);

  const expandAll = useCallback(() => {
    setOpen(releases.map((release) => release.version));
  }, []);

  const collapseAll = useCallback(() => setOpen([]), []);

  const focusRelease = useCallback(
    (version: string) => {
      setOpen((current) => (current.includes(version) ? current : [...current, version]));
      window.requestAnimationFrame(() => {
        document.getElementById(releaseAnchorId(version))?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    },
    [reducedMotion],
  );

  return {
    releases,
    isOpen,
    toggle,
    expandAll,
    collapseAll,
    focusRelease,
    allOpen: open.length === releases.length,
  };
}
