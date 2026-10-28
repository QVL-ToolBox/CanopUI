const graphemeSegmenter =
  "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : undefined;

export function graphemesOf(text: string): string[] {
  if (!graphemeSegmenter) return Array.from(text);
  return Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment);
}

export function withoutLastGrapheme(text: string): string {
  return graphemesOf(text).slice(0, -1).join("");
}

export function graphemeEndsBeforeLast(text: string): number[] {
  const ends: number[] = [];
  let end = 0;
  for (const grapheme of graphemesOf(text)) {
    end += grapheme.length;
    if (end < text.length) ends.push(end);
  }
  return ends;
}
