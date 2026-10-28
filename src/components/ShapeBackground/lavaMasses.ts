import { between, seededRandom, type RandomSource } from "./seededRandom";

export interface LavaWave {
  amplitude: number;
  angular: number;
  phase: number;
}

export interface LavaMass {
  index: number;
  sizeShare: number;
  centerX: number;
  centerY: number;
  wavesX: readonly LavaWave[];
  wavesY: readonly LavaWave[];
  breath: LavaWave;
}

export interface LavaBlob {
  x: number;
  y: number;
  sizeShare: number;
  breath: number;
}

type Range = readonly [number, number];

const SEED = 4211;
const TAU = Math.PI * 2;
const MIN_MASSES = 1;
const MAX_MASSES = 10;
const SPREAD_MARGIN = 0.12;

function wave(random: RandomSource, amplitude: Range, periodSeconds: Range): LavaWave {
  return {
    amplitude: between(random, ...amplitude),
    angular: TAU / between(random, ...periodSeconds),
    phase: between(random, 0, TAU),
  };
}

function halton(index: number, base: number): number {
  let result = 0;
  let fraction = 1 / base;
  let rest = index;
  while (rest > 0) {
    result += fraction * (rest % base);
    rest = Math.floor(rest / base);
    fraction /= base;
  }
  return result;
}

function spread(share: number): number {
  return SPREAD_MARGIN + share * (1 - 2 * SPREAD_MARGIN);
}

function createMass(random: RandomSource, index: number): LavaMass {
  return {
    index,
    sizeShare: between(random, 0.55, 1.35),
    centerX: spread(halton(index + 1, 2)),
    centerY: spread(halton(index + 1, 3)),
    wavesX: [wave(random, [0.06, 0.12], [26, 48]), wave(random, [0.03, 0.06], [13, 22])],
    wavesY: [wave(random, [0.08, 0.14], [30, 56]), wave(random, [0.03, 0.06], [15, 24])],
    breath: wave(random, [0.05, 0.12], [8, 14]),
  };
}

const ALL_MASSES: readonly LavaMass[] = (() => {
  const random = seededRandom(SEED);
  return Array.from({ length: MAX_MASSES }, (_, index) => createMass(random, index));
})();

export function lavaMasses(count: number): LavaMass[] {
  const clamped = Math.min(MAX_MASSES, Math.max(MIN_MASSES, Math.round(count)));
  return ALL_MASSES.slice(0, clamped);
}

function oscillation({ amplitude, angular, phase }: LavaWave, seconds: number): number {
  return amplitude * Math.sin(angular * seconds + phase);
}

function swing(waves: readonly LavaWave[], seconds: number): number {
  let sum = 0;
  for (let index = 0; index < waves.length; index += 1) {
    sum += oscillation(waves[index], seconds);
  }
  return sum;
}

export function emptyBlob(): LavaBlob {
  return { x: 0, y: 0, sizeShare: 0, breath: 0 };
}

export function blobAt(mass: LavaMass, seconds: number, into: LavaBlob = emptyBlob()): LavaBlob {
  into.x = mass.centerX + swing(mass.wavesX, seconds);
  into.y = mass.centerY + swing(mass.wavesY, seconds);
  into.sizeShare = mass.sizeShare;
  into.breath = 1 + oscillation(mass.breath, seconds);
  return into;
}
