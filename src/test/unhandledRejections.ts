import { afterEach, beforeEach } from "vitest";

export function suivreLesRejetsNonGeres(): unknown[] {
  const rejets: unknown[] = [];
  const consigner = (raison: unknown) => {
    rejets.push(raison);
  };
  beforeEach(() => {
    rejets.length = 0;
    process.on("unhandledRejection", consigner);
  });
  afterEach(() => {
    process.off("unhandledRejection", consigner);
  });
  return rejets;
}

export async function laisserPasserLesMicrotaches() {
  await new Promise((resolve) => setTimeout(resolve, 20));
}
