export interface CanopChunkRange {
  index: number;
  start: number;
  end: number;
  size: number;
}

export function planChunks(totalSize: number, chunkSize: number): CanopChunkRange[] {
  if (chunkSize <= 0) {
    throw new Error("chunkSize doit etre strictement positif");
  }
  const ranges: CanopChunkRange[] = [];
  let index = 0;
  let start = 0;
  while (start < totalSize) {
    const end = Math.min(start + chunkSize, totalSize);
    ranges.push({ index, start, end, size: end - start });
    start = end;
    index += 1;
  }
  if (ranges.length === 0) {
    ranges.push({ index: 0, start: 0, end: 0, size: 0 });
  }
  return ranges;
}

export function countChunks(totalSize: number, chunkSize: number): number {
  return planChunks(totalSize, chunkSize).length;
}

export function firstMissingChunkIndex(receivedBytes: number, chunkSize: number): number {
  if (receivedBytes <= 0) {
    return 0;
  }
  return Math.floor(receivedBytes / chunkSize);
}

export function pendingChunks(
  allChunks: CanopChunkRange[],
  receivedBytes: number,
  chunkSize: number,
): CanopChunkRange[] {
  const resumeIndex = firstMissingChunkIndex(receivedBytes, chunkSize);
  return allChunks.filter((chunk) => chunk.index >= resumeIndex);
}
