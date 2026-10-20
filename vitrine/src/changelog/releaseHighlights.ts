import type { ChangelogBlock, ChangelogInline, ChangelogRelease } from "./parseChangelog";

const LEAD_SEPARATOR = /\s+[:—-]\s+/;
const MARKUP = /[`*]/g;
const MAX_LENGTH = 64;
const SECTION_ORDER = ["Ajouté", "Modifié", "Corrigé", "Supprimé"];

function sectionRank(title: string): number {
  const index = SECTION_ORDER.indexOf(title);
  return index === -1 ? SECTION_ORDER.length : index;
}

function clamp(label: string): string {
  const clean = label.replace(MARKUP, "").trim();
  return clean.length > MAX_LENGTH ? `${clean.slice(0, MAX_LENGTH).trimEnd()}…` : clean;
}

function leadInline(item: ChangelogBlock[]): ChangelogInline[] | undefined {
  const paragraph = item.find((block) => block.kind === "paragraph");
  return paragraph?.kind === "paragraph" ? paragraph.content : undefined;
}

function markedLabel(item: ChangelogBlock[]): string | undefined {
  const content = leadInline(item);
  const lead = content?.[0];
  if (!lead || (lead.kind !== "strong" && lead.kind !== "code")) return undefined;
  const label = clamp(lead.value);
  return label.length > 0 ? label : undefined;
}

function plainLabel(item: ChangelogBlock[]): string | undefined {
  const content = leadInline(item);
  if (!content) return undefined;
  const text = content.map((part) => part.value).join("");
  const label = clamp(text.split(LEAD_SEPARATOR)[0]);
  return label.length > 0 ? label : undefined;
}

function collect(
  release: ChangelogRelease,
  label: (item: ChangelogBlock[]) => string | undefined,
  labels: string[],
  limit: number,
): void {
  const ordered = [...release.sections].sort(
    (left, right) => sectionRank(left.title) - sectionRank(right.title),
  );
  for (const section of ordered) {
    for (const block of section.blocks) {
      if (block.kind !== "list") continue;
      for (const item of block.items) {
        if (labels.length >= limit) return;
        const found = label(item);
        if (found && !labels.includes(found)) labels.push(found);
      }
    }
  }
}

export function releaseHighlights(release: ChangelogRelease, limit = 3): string[] {
  const labels: string[] = [];
  collect(release, markedLabel, labels, limit);
  if (labels.length < limit) collect(release, plainLabel, labels, limit);
  return labels;
}
