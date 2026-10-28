export interface FrameBatch {
  schedule: () => void;
  cancel: () => void;
}

export function frameBatch(task: () => void): FrameBatch {
  if (typeof requestAnimationFrame !== "function") return { schedule: task, cancel: () => {} };
  let frame: number | null = null;
  return {
    schedule: () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        task();
      });
    },
    cancel: () => {
      if (frame === null) return;
      cancelAnimationFrame(frame);
      frame = null;
    },
  };
}
