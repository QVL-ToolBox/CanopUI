import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

const OFF_SEASON_DATE = new Date(2026, 5, 10, 12);

beforeEach(() => {
  vi.setSystemTime(OFF_SEASON_DATE);
});

afterEach(() => {
  cleanup();
});
