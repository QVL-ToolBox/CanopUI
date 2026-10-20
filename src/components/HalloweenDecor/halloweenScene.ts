import {
  batFlock,
  batSwarm,
  cornerWebs,
  danglingSpiders,
  ghostCrew,
  graveGhost,
  pumpkinPatch,
} from "./halloweenSceneData";
import type {
  CanopHalloweenDecorDensity,
  HalloweenDepth,
  HalloweenFireflySpec,
  HalloweenGhostSpec,
  HalloweenLeafHue,
  HalloweenLeafSpec,
  HalloweenScene,
  HalloweenSparkleSpec,
  HalloweenStarSpec,
} from "./halloweenSceneTypes";

const GOLDEN_RATIO_CONJUGATE = 0.618034;
const SILVER_STEP = 0.382;
const LEAF_HUES: readonly HalloweenLeafHue[] = ["amber", "rust", "plum"];

interface HalloweenCounts {
  stars: number;
  bats: number;
  swarm: boolean;
  ghosts: number;
  spiders: number;
  sparkles: number;
  pumpkins: number;
  leaves: number;
  fireflies: number;
  cauldron: boolean;
  witchCycle: number;
}

const densityCounts: Record<CanopHalloweenDecorDensity, HalloweenCounts> = {
  low: {
    stars: 16,
    bats: 4,
    swarm: false,
    ghosts: 4,
    spiders: 1,
    sparkles: 5,
    pumpkins: 3,
    leaves: 4,
    fireflies: 6,
    cauldron: false,
    witchCycle: 37,
  },
  medium: {
    stars: 26,
    bats: 7,
    swarm: true,
    ghosts: 7,
    spiders: 2,
    sparkles: 8,
    pumpkins: 5,
    leaves: 8,
    fireflies: 12,
    cauldron: true,
    witchCycle: 29,
  },
};

function percent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function rem(value: number): string {
  return `${value.toFixed(3)}rem`;
}

function fraction(index: number, step: number, offset: number): number {
  return (index * step + offset) % 1;
}

function star(index: number): HalloweenStarSpec {
  const glint = index % 7 === 3;
  const depth = fraction(index, SILVER_STEP, 0.13);
  return {
    id: `star-${index}`,
    left: percent(2 + fraction(index, GOLDEN_RATIO_CONJUGATE, 0.07) * 96),
    top: percent(2 + depth * 28),
    size: glint ? rem(0.7 + depth * 0.25) : rem(0.12 + depth * 0.12),
    glint,
    twinkle: 2.9 + (index % 5) * 0.8,
    delay: -index * 0.7,
  };
}

function edgeColumn(index: number, spread: number, width: number): number {
  return index % 2 === 0 ? 2 + spread * width : 98 - width + spread * width;
}

function leaf(index: number): HalloweenLeafSpec {
  return {
    id: `leaf-${index}`,
    left: percent(edgeColumn(index, fraction(index, GOLDEN_RATIO_CONJUGATE, 0.21), 20)),
    size: rem(0.9 + (index % 3) * 0.3),
    hue: LEAF_HUES[index % LEAF_HUES.length],
    fall: 13 + (index % 4) * 2.7,
    sway: 3.1 + (index % 3) * 0.8,
    spin: 6 + (index % 4) * 1.1,
    delay: -index * 3.3,
    restY: percent(15 + fraction(index, SILVER_STEP, 0.4) * 65),
  };
}

function firefly(index: number): HalloweenFireflySpec {
  const depth = fraction(index, SILVER_STEP, 0.17);
  return {
    id: `firefly-${index}`,
    left: percent(edgeColumn(index, fraction(index, GOLDEN_RATIO_CONJUGATE, 0), 28)),
    top: percent(55 + depth * 35),
    size: rem(0.25 + depth * 0.2),
    drift: 9 + (index % 5) * 1.3,
    twinkle: 2.6 + (index % 4) * 0.5,
    delay: -index * 0.9,
  };
}

function sparkle(index: number): HalloweenSparkleSpec {
  return {
    id: `sparkle-${index}`,
    left: percent(2 + (index % 3) * 4),
    top: percent(60 + fraction(index, GOLDEN_RATIO_CONJUGATE, 0.3) * 24),
    size: rem(0.2 + (index % 3) * 0.08),
    seconds: 1.1 + (index % 3) * 0.25,
    delay: -index * 0.19,
  };
}

function byDepth(ghosts: HalloweenGhostSpec[]): Record<HalloweenDepth, HalloweenGhostSpec[]> {
  return {
    far: ghosts.filter((ghost) => ghost.depth === "far"),
    mid: ghosts.filter((ghost) => ghost.depth === "mid"),
    near: ghosts.filter((ghost) => ghost.depth === "near"),
    ground: ghosts.filter((ghost) => ghost.depth === "ground"),
  };
}

function generate<T>(count: number, build: (index: number) => T): T[] {
  return Array.from({ length: count }, (_, index) => build(index));
}

export function halloweenScene(density: CanopHalloweenDecorDensity): HalloweenScene {
  const counts = densityCounts[density];
  return {
    stars: generate(counts.stars, star),
    bats: batFlock.slice(0, counts.bats),
    swarm: counts.swarm ? batSwarm : null,
    ghosts: byDepth(ghostCrew.slice(0, counts.ghosts)),
    graveGhost,
    webs: cornerWebs,
    spiders: danglingSpiders.slice(0, counts.spiders),
    witch: {
      cycle: counts.witchCycle,
      delay: 4,
      sparkles: generate(counts.sparkles, sparkle),
    },
    pumpkins: pumpkinPatch.slice(0, counts.pumpkins),
    leaves: generate(counts.leaves, leaf),
    fireflies: generate(counts.fireflies, firefly),
    cauldron: counts.cauldron,
  };
}
