import { useCallback, useEffect, useState, type RefObject } from "react";
import { useReducedMotion } from "@canop/ui";

export interface DocTocEntry {
  id: string;
  title: string;
}

export interface UseDocTocOptions {
  articleRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  revision: string;
}

export interface UseDocTocResult {
  entries: DocTocEntry[];
  activeId: string | undefined;
  scrollToSection: (id: string) => void;
}

const SECTION_SELECTOR = "[data-doc-section]";
const READING_BAND = "0px 0px -60% 0px";

function sectionIdOf(element: Element): string {
  return element instanceof HTMLElement ? (element.dataset.docSection ?? "") : "";
}

function tocEntryOf(section: HTMLElement): DocTocEntry {
  return { id: sectionIdOf(section), title: section.querySelector("h2")?.textContent ?? "" };
}

function sectionsOf(article: HTMLElement | null): HTMLElement[] {
  return article ? Array.from(article.querySelectorAll<HTMLElement>(SECTION_SELECTOR)) : [];
}

export function useDocToc({ articleRef, enabled, revision }: UseDocTocOptions): UseDocTocResult {
  const reducedMotion = useReducedMotion();
  const [entries, setEntries] = useState<DocTocEntry[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const sections = enabled ? sectionsOf(articleRef.current) : [];
    setEntries(sections.map(tocEntryOf));
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          const id = sectionIdOf(record.target);
          if (record.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        const firstVisible = sections.find((section) => visible.has(sectionIdOf(section)));
        if (firstVisible) setActiveId(sectionIdOf(firstVisible));
      },
      { rootMargin: READING_BAND },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [articleRef, enabled, revision]);

  const scrollToSection = useCallback(
    (id: string) => {
      const target = sectionsOf(articleRef.current).find((section) => sectionIdOf(section) === id);
      target?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      setActiveId(id);
    },
    [articleRef, reducedMotion],
  );

  return { entries, activeId, scrollToSection };
}
