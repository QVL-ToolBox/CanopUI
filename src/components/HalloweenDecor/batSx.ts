import type { CSSObject } from "@mui/material/styles";
import { keyframes, loop, when } from "./halloweenMotion";
import type {
  HalloweenBatAltitude,
  HalloweenBatCruise,
  HalloweenBatSpec,
  HalloweenSwarmBatSpec,
  HalloweenSwarmSpec,
} from "./halloweenSceneTypes";
import { halloweenTone } from "./halloweenTones";

const HEADING_VAR = "--canop-halloween-heading";
const RADIUS_VAR = "--canop-halloween-radius";

const WING_LEFT = "canop-halloween-wing-left";
const WING_RIGHT = "canop-halloween-wing-right";
const BAT_JITTER = "canop-halloween-bat-jitter";
const BAT_LOOP = "canop-halloween-bat-loop";
const SWARM_DRIFT = "canop-halloween-swarm-drift";
const SWARM_SWING = "canop-halloween-swarm-swing";
const SWARM_BOB = "canop-halloween-swarm-bob";
const SWARM_TURN = "canop-halloween-swarm-turn";

const cruiseName: Record<HalloweenBatCruise, string> = {
  swoop: "canop-halloween-bat-cruise-swoop",
  zigzag: "canop-halloween-bat-cruise-zigzag",
  glide: "canop-halloween-bat-cruise-glide",
};

const altitudeName: Record<HalloweenBatAltitude, string> = {
  dive: "canop-halloween-bat-altitude-dive",
  rollercoaster: "canop-halloween-bat-altitude-rollercoaster",
};

function across(position: string): CSSObject {
  return { transform: `translateX(${position})` };
}

const cruiseFrames: Record<HalloweenBatCruise, CSSObject> = {
  swoop: {
    "0%": across("-14%"),
    "12%": across("6%"),
    "22%": across("31%"),
    "30%": across("38%"),
    "41%": across("52%"),
    "47%": across("74%"),
    "58%": across("86%"),
    "66%, 100%": across("114%"),
  },
  zigzag: {
    "0%": across("-14%"),
    "9%": across("10%"),
    "15%": across("6%"),
    "26%": across("29%"),
    "33%": across("24%"),
    "45%": across("55%"),
    "52%": across("49%"),
    "63%": across("82%"),
    "72%, 100%": across("114%"),
  },
  glide: {
    "0%": across("-14%"),
    "30%": across("30%"),
    "38%": across("41%"),
    "55%": across("63%"),
    "62%, 100%": across("114%"),
  },
};

function climb(lift: string, tilt: number): CSSObject {
  return { transform: `translateY(${lift}) rotate(calc(${tilt}deg * var(${HEADING_VAR})))` };
}

const altitudeFrames: Record<HalloweenBatAltitude, CSSObject> = {
  dive: {
    "0%, 100%": climb("0rem", 10),
    "11%": climb("4.5rem", -22),
    "19%": climb("-1.5rem", 16),
    "31%": climb("2rem", -12),
    "44%": climb("-3rem", 24),
    "52%": climb("3.5rem", -18),
    "67%": climb("0.5rem", 14),
    "80%": climb("5rem", -26),
    "91%": climb("-1rem", 12),
  },
  rollercoaster: {
    "0%, 100%": climb("0rem", -14),
    "14%": climb("-2.5rem", 20),
    "23%": climb("3rem", -18),
    "37%": climb("-0.5rem", 22),
    "49%": climb("4rem", -12),
    "57%": climb("1rem", 8),
    "70%": climb("2.5rem", -20),
    "84%": climb("-2rem", 10),
  },
};

export function batCruiseSx(spec: HalloweenBatSpec, animated: boolean): CSSObject {
  const name = cruiseName[spec.cruise];
  return {
    position: "absolute",
    top: spec.top,
    left: 0,
    width: "100%",
    transform: `translateX(${spec.restX})`,
    [HEADING_VAR]: String(spec.heading),
    ...when(animated, {
      willChange: "transform",
      animation: loop(
        name,
        spec.cruiseSeconds,
        spec.delay,
        spec.heading === 1 ? "normal" : "reverse",
      ),
      ...keyframes(name, cruiseFrames[spec.cruise]),
    }),
  };
}

export function batAltitudeSx(spec: HalloweenBatSpec, animated: boolean): CSSObject {
  const name = altitudeName[spec.altitude];
  return {
    width: spec.size,
    ...when(animated, {
      animation: loop(name, spec.altitudeSeconds, spec.delay),
      ...keyframes(name, altitudeFrames[spec.altitude]),
    }),
  };
}

export function batJitterSx(spec: HalloweenBatSpec, animated: boolean): CSSObject {
  return when(animated, {
    animation: loop(BAT_JITTER, spec.jitterSeconds, spec.delay),
    ...keyframes(BAT_JITTER, {
      "0%, 100%": { transform: "translate(0, 0)" },
      "13%": { transform: "translate(0.4rem, -0.5rem)" },
      "27%": { transform: "translate(-0.3rem, 0.3rem)" },
      "38%": { transform: "translate(0.5rem, 0.4rem)" },
      "54%": { transform: "translate(-0.5rem, -0.2rem)" },
      "69%": { transform: "translate(0.2rem, 0.6rem)" },
      "83%": { transform: "translate(-0.4rem, -0.4rem)" },
    }),
  });
}

export function batLoopSx(spec: HalloweenBatSpec, animated: boolean): CSSObject {
  return when(animated, {
    transformOrigin: "50% -150%",
    animation: loop(BAT_LOOP, spec.loopSeconds, spec.delay),
    ...keyframes(BAT_LOOP, {
      "0%, 72%": { transform: "rotate(0deg)" },
      "86%, 100%": { transform: `rotate(calc(-360deg * var(${HEADING_VAR})))` },
    }),
  });
}

const WING_PIVOT = { transformBox: "view-box", transformOrigin: "50% 44%" } as const;

export function batGlyphSx(mirrored: boolean, flap: number, animated: boolean): CSSObject {
  return {
    display: "block",
    width: "100%",
    height: "auto",
    overflow: "visible",
    color: halloweenTone("bat"),
    transform: mirrored ? "scaleX(-1)" : "none",
    "& [data-part='eye']": { fill: halloweenTone("batEye") },
    "& [data-part='wing-left']": {
      ...WING_PIVOT,
      ...when(animated, { animation: loop(WING_LEFT, flap, 0) }),
    },
    "& [data-part='wing-right']": {
      ...WING_PIVOT,
      ...when(animated, { animation: loop(WING_RIGHT, flap, 0) }),
    },
    ...when(animated, {
      ...keyframes(WING_LEFT, {
        "0%, 100%": { transform: "rotate(-16deg)" },
        "50%": { transform: "rotate(24deg) scaleY(0.72)" },
      }),
      ...keyframes(WING_RIGHT, {
        "0%, 100%": { transform: "rotate(16deg)" },
        "50%": { transform: "rotate(-24deg) scaleY(0.72)" },
      }),
    }),
  };
}

export function swarmSx(spec: HalloweenSwarmSpec, animated: boolean): CSSObject {
  return {
    position: "absolute",
    left: spec.left,
    top: spec.top,
    width: 0,
    height: 0,
    ...when(animated, {
      animation: loop(SWARM_DRIFT, 23, 0, "alternate"),
      ...keyframes(SWARM_DRIFT, {
        "0%": { transform: "translate(0, 0)" },
        "35%": { transform: "translate(3rem, 1.5rem)" },
        "70%": { transform: "translate(-1.5rem, 2.5rem)" },
        "100%": { transform: "translate(2rem, -0.5rem)" },
      }),
    }),
  };
}

export function swarmSwingSx(bat: HalloweenSwarmBatSpec, animated: boolean): CSSObject {
  return {
    position: "absolute",
    left: 0,
    top: 0,
    [RADIUS_VAR]: bat.radius,
    transform: `translateX(${bat.radius})`,
    ...when(animated, {
      animation: loop(SWARM_SWING, bat.seconds, bat.delay, "alternate"),
      ...keyframes(SWARM_SWING, {
        "0%": { transform: `translateX(calc(var(${RADIUS_VAR}) * -1))` },
        "100%": { transform: `translateX(var(${RADIUS_VAR}))` },
      }),
    }),
  };
}

export function swarmBobSx(bat: HalloweenSwarmBatSpec, animated: boolean): CSSObject {
  return {
    width: bat.size,
    ...when(animated, {
      animation: loop(SWARM_BOB, bat.seconds, bat.delay - bat.seconds / 2, "alternate"),
      ...keyframes(SWARM_BOB, {
        "0%": { transform: `translateY(calc(var(${RADIUS_VAR}) * -0.45))` },
        "100%": { transform: `translateY(calc(var(${RADIUS_VAR}) * 0.45))` },
      }),
    }),
  };
}

export function swarmTurnSx(bat: HalloweenSwarmBatSpec, animated: boolean): CSSObject {
  return when(animated, {
    animation: loop(SWARM_TURN, bat.seconds * 2, bat.delay, "normal", "linear"),
    ...keyframes(SWARM_TURN, {
      "0%, 49%": { transform: "scaleX(1)" },
      "51%, 100%": { transform: "scaleX(-1)" },
    }),
  });
}
