export type CanopSoundName = "click" | "start" | "correct" | "wrong" | "finish";

export const canopSoundNames: readonly CanopSoundName[] = [
  "click",
  "start",
  "correct",
  "wrong",
  "finish",
];

export interface CanopSoundNote {
  frequency: number;
  offset?: number;
  duration: number;
  wave?: OscillatorType;
  gain?: number;
}

export type CanopSoundRecipe = readonly CanopSoundNote[];

const DO5 = 523.25;
const MI5 = 659.25;
const SOL5 = 783.99;
const DO6 = 1046.5;

export const canopSoundRecipes: Record<CanopSoundName, CanopSoundRecipe> = {
  click: [{ frequency: 520, duration: 0.06, wave: "triangle", gain: 0.07 }],
  start: [
    { frequency: 440, duration: 0.12, wave: "sine", gain: 0.1 },
    { frequency: 660, offset: 0.07, duration: 0.16, wave: "sine", gain: 0.1 },
  ],
  correct: [
    { frequency: DO5, duration: 0.1, wave: "triangle", gain: 0.11 },
    { frequency: MI5, offset: 0.06, duration: 0.1, wave: "triangle", gain: 0.11 },
    { frequency: SOL5, offset: 0.12, duration: 0.16, wave: "triangle", gain: 0.11 },
  ],
  wrong: [
    { frequency: 196, duration: 0.16, wave: "sawtooth", gain: 0.08 },
    { frequency: 147, offset: 0.1, duration: 0.22, wave: "sawtooth", gain: 0.08 },
  ],
  finish: [
    { frequency: DO5, duration: 0.14, wave: "triangle", gain: 0.11 },
    { frequency: MI5, offset: 0.1, duration: 0.14, wave: "triangle", gain: 0.11 },
    { frequency: SOL5, offset: 0.2, duration: 0.14, wave: "triangle", gain: 0.11 },
    { frequency: DO6, offset: 0.3, duration: 0.28, wave: "triangle", gain: 0.12 },
  ],
};
