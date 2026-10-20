export type ChangelogInline =
  | { kind: "text"; value: string }
  | { kind: "strong"; value: string }
  | { kind: "code"; value: string }
  | { kind: "link"; value: string; href: string };

export type ChangelogBlock =
  | { kind: "paragraph"; content: ChangelogInline[] }
  | { kind: "quote"; blocks: ChangelogBlock[] }
  | { kind: "list"; ordered: boolean; items: ChangelogBlock[][] }
  | { kind: "table"; head: ChangelogInline[][]; rows: ChangelogInline[][][] };

export interface ChangelogSection {
  title: string;
  blocks: ChangelogBlock[];
  entryCount: number;
}

export interface ChangelogRelease {
  version: string;
  date: string;
  intro: ChangelogBlock[];
  sections: ChangelogSection[];
  entryCount: number;
}

const RELEASE_HEADING = /^##\s+\[([^\]]+)\]\s*(?:[-–—]\s*(.*))?$/;
const RELEASE_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SECTION_HEADING = /^###\s+(.+)$/;
const BULLET_MARKER = /^[-*]\s+/;
const ORDERED_MARKER = /^\d+\.\s+/;
const INLINE_PATTERN = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
const CONTINUATION_INDENT = /^ {2,4}/;

function splitCells(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inCode = false;
  for (const char of line) {
    if (char === "`") {
      inCode = !inCode;
      current += char;
      continue;
    }
    if (char === "|" && !inCode) {
      cells.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current);
  return cells.slice(1, -1).map((cell) => cell.trim());
}

export function parseInline(text: string): ChangelogInline[] {
  const parts: ChangelogInline[] = [];
  let cursor = 0;
  for (const match of text.matchAll(INLINE_PATTERN)) {
    const start = match.index ?? 0;
    if (start > cursor) {
      parts.push({ kind: "text", value: text.slice(cursor, start) });
    }
    if (match[1] !== undefined) {
      parts.push({ kind: "code", value: match[1] });
    } else if (match[2] !== undefined) {
      parts.push({ kind: "strong", value: match[2] });
    } else {
      parts.push({ kind: "link", value: match[3], href: match[4] });
    }
    cursor = start + match[0].length;
  }
  if (cursor < text.length) {
    parts.push({ kind: "text", value: text.slice(cursor) });
  }
  return parts;
}

function isBlank(line: string | undefined): boolean {
  return line === undefined || line.trim() === "";
}

function isTableRow(line: string): boolean {
  return line.trimStart().startsWith("|");
}

function isTableDivider(line: string): boolean {
  return /^\|[\s:|-]+\|$/.test(line.trim()) && line.includes("-");
}

function isIndented(line: string): boolean {
  return CONTINUATION_INDENT.test(line);
}

function nextFilled(lines: string[], from: number): number {
  let index = from;
  while (index < lines.length && isBlank(lines[index])) index += 1;
  return index < lines.length ? index : -1;
}

function markerOf(line: string): RegExp | undefined {
  if (BULLET_MARKER.test(line)) return BULLET_MARKER;
  if (ORDERED_MARKER.test(line)) return ORDERED_MARKER;
  return undefined;
}

function takeTable(lines: string[], start: number): { block: ChangelogBlock; next: number } {
  const collected: string[] = [];
  let index = start;
  while (index < lines.length && isTableRow(lines[index])) {
    collected.push(lines[index].trim());
    index += 1;
  }
  const [head, ...rows] = collected.filter((row) => !isTableDivider(row));
  return {
    block: {
      kind: "table",
      head: splitCells(head).map(parseInline),
      rows: rows.map((row) => splitCells(row).map(parseInline)),
    },
    next: index,
  };
}

function takeQuote(lines: string[], start: number): { block: ChangelogBlock; next: number } {
  const inner: string[] = [];
  let index = start;
  while (index < lines.length && lines[index].startsWith(">")) {
    inner.push(lines[index].replace(/^>\s?/, ""));
    index += 1;
  }
  return { block: { kind: "quote", blocks: parseBlocks(inner) }, next: index };
}

function takeList(
  lines: string[],
  start: number,
  marker: RegExp,
): { block: ChangelogBlock; next: number } {
  const items: string[][] = [];
  let index = start;
  while (index < lines.length) {
    const line = lines[index];
    if (isBlank(line)) {
      const filled = nextFilled(lines, index);
      if (filled === -1) break;
      if (!isIndented(lines[filled]) && !marker.test(lines[filled])) break;
      if (items.length > 0) items[items.length - 1].push("");
      index += 1;
      continue;
    }
    if (marker.test(line)) {
      items.push([line.replace(marker, "")]);
      index += 1;
      continue;
    }
    if (isIndented(line) && items.length > 0) {
      items[items.length - 1].push(line.replace(CONTINUATION_INDENT, ""));
      index += 1;
      continue;
    }
    break;
  }
  return {
    block: { kind: "list", ordered: marker === ORDERED_MARKER, items: items.map(parseBlocks) },
    next: index,
  };
}

function takeParagraph(lines: string[], start: number): { block: ChangelogBlock; next: number } {
  const parts: string[] = [];
  let index = start;
  while (index < lines.length) {
    const line = lines[index];
    if (isBlank(line) || isTableRow(line) || line.startsWith(">") || markerOf(line)) break;
    parts.push(line.trim());
    index += 1;
  }
  return { block: { kind: "paragraph", content: parseInline(parts.join(" ")) }, next: index };
}

export function parseBlocks(lines: string[]): ChangelogBlock[] {
  const blocks: ChangelogBlock[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (isBlank(line)) {
      index += 1;
      continue;
    }
    const marker = markerOf(line);
    const taken = isTableRow(line)
      ? takeTable(lines, index)
      : line.startsWith(">")
        ? takeQuote(lines, index)
        : marker
          ? takeList(lines, index, marker)
          : takeParagraph(lines, index);
    blocks.push(taken.block);
    index = taken.next > index ? taken.next : index + 1;
  }
  return blocks;
}

function countEntries(blocks: ChangelogBlock[]): number {
  return blocks.reduce(
    (total, block) => (block.kind === "list" ? total + block.items.length : total),
    0,
  );
}

function buildSection(title: string, lines: string[]): ChangelogSection {
  const blocks = parseBlocks(lines);
  return { title, blocks, entryCount: countEntries(blocks) };
}

export function parseChangelog(source: string): ChangelogRelease[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const releases: ChangelogRelease[] = [];
  let release: ChangelogRelease | undefined;
  let sectionTitle: string | undefined;
  let buffer: string[] = [];

  const flush = () => {
    if (release) {
      if (sectionTitle === undefined) {
        release.intro = parseBlocks(buffer);
      } else {
        release.sections.push(buildSection(sectionTitle, buffer));
      }
    }
    buffer = [];
  };

  for (const line of lines) {
    const heading = RELEASE_HEADING.exec(line);
    if (heading) {
      flush();
      sectionTitle = undefined;
      const date = (heading[2] ?? "").trim();
      release = RELEASE_DATE.test(date)
        ? { version: heading[1], date, intro: [], sections: [], entryCount: 0 }
        : undefined;
      if (release) releases.push(release);
      continue;
    }
    const section = SECTION_HEADING.exec(line);
    if (section && release) {
      flush();
      sectionTitle = section[1].trim();
      continue;
    }
    buffer.push(line);
  }
  flush();

  for (const entry of releases) {
    entry.entryCount = entry.sections.reduce((total, section) => total + section.entryCount, 0);
  }
  return releases;
}

function versionParts(version: string): number[] {
  return version.split(".").map((part) => Number.parseInt(part, 10) || 0);
}

export function compareVersions(left: string, right: string): number {
  const a = versionParts(left);
  const b = versionParts(right);
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    const diff = (a[index] ?? 0) - (b[index] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export type ChangelogReleaseStatus = "upcoming" | "current" | "past";

export function releaseStatus(version: string, published: string): ChangelogReleaseStatus {
  const diff = compareVersions(version, published);
  if (diff > 0) return "upcoming";
  if (diff === 0) return "current";
  return "past";
}

export function releaseAnchorId(version: string): string {
  return `release-${version.replace(/\./g, "-")}`;
}
