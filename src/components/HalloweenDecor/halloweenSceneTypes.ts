export type CanopHalloweenDecorDensity = "low" | "medium";

export type CanopHalloweenDecorScope = "container" | "viewport";

export type HalloweenDecorBudget = "full" | "lite";

export type HalloweenSide = "left" | "right";

type HalloweenHeading = 1 | -1;

export type HalloweenDepth = "far" | "mid" | "near" | "ground";

export type HalloweenExpression = "boo" | "smile" | "surprised" | "sleepy";

export type HalloweenBatCruise = "swoop" | "zigzag" | "glide";

export type HalloweenBatAltitude = "dive" | "rollercoaster";

export type HalloweenLeafHue = "amber" | "rust" | "plum";

export interface HalloweenStarSpec {
  id: string;
  left: string;
  top: string;
  size: string;
  glint: boolean;
  twinkle: number;
  delay: number;
}

export interface HalloweenBatSpec {
  id: string;
  top: string;
  size: string;
  cruise: HalloweenBatCruise;
  altitude: HalloweenBatAltitude;
  cruiseSeconds: number;
  altitudeSeconds: number;
  jitterSeconds: number;
  loopSeconds: number;
  flap: number;
  delay: number;
  heading: HalloweenHeading;
  restX: string;
}

export interface HalloweenSwarmBatSpec {
  id: string;
  radius: string;
  size: string;
  seconds: number;
  delay: number;
  flap: number;
}

export interface HalloweenSwarmSpec {
  left: string;
  top: string;
  bats: HalloweenSwarmBatSpec[];
}

interface HalloweenGhostBase {
  id: string;
  depth: HalloweenDepth;
  expression: HalloweenExpression;
  size: string;
  top: string;
}

export interface HalloweenWanderGhostSpec extends HalloweenGhostBase {
  behavior: "wander";
  from: string;
  to: string;
  drift: number;
  float: number;
  breathe: number;
  delay: number;
}

export interface HalloweenFadeGhostSpec extends HalloweenGhostBase {
  behavior: "fade";
  left: string;
  cycle: number;
  delay: number;
}

export interface HalloweenPeekGhostSpec extends HalloweenGhostBase {
  behavior: "peek";
  side: HalloweenSide;
  cycle: number;
  delay: number;
}

export interface HalloweenRiseGhostSpec extends HalloweenGhostBase {
  behavior: "rise";
  left: string;
  cycle: number;
  delay: number;
}

export type HalloweenGhostSpec =
  | HalloweenWanderGhostSpec
  | HalloweenFadeGhostSpec
  | HalloweenPeekGhostSpec
  | HalloweenRiseGhostSpec;

export interface HalloweenGraveGhostSpec {
  expression: HalloweenExpression;
  cycle: number;
  delay: number;
}

export interface HalloweenWebSpec {
  id: string;
  side: HalloweenSide;
  hiddenOnMobile: boolean;
  size: string;
  delay: number;
}

export interface HalloweenSpiderSpec {
  id: string;
  side: HalloweenSide;
  hiddenOnMobile: boolean;
  inset: string;
  top: string;
  thread: string;
  cycle: number;
  delay: number;
}

export interface HalloweenSparkleSpec {
  id: string;
  left: string;
  top: string;
  size: string;
  seconds: number;
  delay: number;
}

export interface HalloweenWitchSpec {
  cycle: number;
  delay: number;
  sparkles: HalloweenSparkleSpec[];
}

export interface HalloweenPumpkinSpec {
  id: string;
  side: HalloweenSide;
  inset: string;
  size: string;
  lit: boolean;
  flicker: number;
  delay: number;
}

export interface HalloweenLeafSpec {
  id: string;
  left: string;
  size: string;
  hue: HalloweenLeafHue;
  fall: number;
  sway: number;
  spin: number;
  delay: number;
  restY: string;
}

export interface HalloweenFireflySpec {
  id: string;
  left: string;
  top: string;
  size: string;
  drift: number;
  twinkle: number;
  delay: number;
}

export interface HalloweenScene {
  stars: HalloweenStarSpec[];
  bats: HalloweenBatSpec[];
  swarm: HalloweenSwarmSpec | null;
  ghosts: Record<HalloweenDepth, HalloweenGhostSpec[]>;
  graveGhost: HalloweenGraveGhostSpec;
  webs: HalloweenWebSpec[];
  spiders: HalloweenSpiderSpec[];
  witch: HalloweenWitchSpec;
  pumpkins: HalloweenPumpkinSpec[];
  leaves: HalloweenLeafSpec[];
  fireflies: HalloweenFireflySpec[];
  cauldron: boolean;
}
