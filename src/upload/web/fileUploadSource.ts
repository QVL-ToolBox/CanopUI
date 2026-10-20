import type { CanopUploadSource } from "../core";

export function fileUploadSource(file: File): CanopUploadSource {
  return {
    name: file.name,
    size: file.size,
    mime: file.type || undefined,
    slice: async (start, end) => {
      const buffer = await file.slice(start, end).arrayBuffer();
      return new Uint8Array(buffer);
    },
  };
}
