import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { parseChangelog } from "./src/changelog/parseChangelog";
import { summarizeReleases } from "./src/changelog/releaseSummary";

const MODULE_ID = "virtual:canop-release-summary";
const RESOLVED_ID = `\0${MODULE_ID}`;
const CHANGELOG = fileURLToPath(new URL("../CHANGELOG.md", import.meta.url));

export function releaseSummary(): Plugin {
  return {
    name: "canopui:release-summary",

    resolveId(id) {
      return id === MODULE_ID ? RESOLVED_ID : undefined;
    },

    async load(id) {
      if (id !== RESOLVED_ID) return undefined;
      this.addWatchFile(CHANGELOG);
      const summary = summarizeReleases(parseChangelog(await readFile(CHANGELOG, "utf8")));
      return `export default ${JSON.stringify(summary)};`;
    },
  };
}
