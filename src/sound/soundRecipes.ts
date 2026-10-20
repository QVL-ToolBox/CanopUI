/**
 * Le catalogue sémantique des sons.
 *
 * Un consommateur demande `"correct"`, jamais une fréquence : le son est un
 * jeton du design system, comme une couleur. Changer le timbre de la bonne
 * réponse se fait ici, une fois, et non dans chaque écran.
 */
export type CanopSoundName = "click" | "start" | "correct" | "wrong" | "finish";

export const canopSoundNames: readonly CanopSoundName[] = [
  "click",
  "start",
  "correct",
  "wrong",
  "finish",
];

export interface CanopSoundNote {
  /** Hauteur, en hertz. */
  frequency: number;
  /** Décalage du départ, en secondes, depuis le début du son. */
  offset?: number;
  /** Durée, en secondes. */
  duration: number;
  /** Forme d'onde de l'oscillateur. */
  wave?: OscillatorType;
  /** Volume crête de la note, de 0 à 1, avant le volume général. */
  gain?: number;
}

/**
 * Une recette est jouée par synthèse : aucun fichier, rien à télécharger,
 * fonctionne hors-ligne et ne traîne aucune licence.
 */
export type CanopSoundRecipe = readonly CanopSoundNote[];

const DO5 = 523.25;
const MI5 = 659.25;
const SOL5 = 783.99;
const DO6 = 1046.5;

export const canopSoundRecipes: Record<CanopSoundName, CanopSoundRecipe> = {
  /** Tick discret : navigation, boutons secondaires. */
  click: [{ frequency: 520, duration: 0.06, wave: "triangle", gain: 0.07 }],
  /** Ouverture : deux notes qui montent doucement. */
  start: [
    { frequency: 440, duration: 0.12, wave: "sine", gain: 0.1 },
    { frequency: 660, offset: 0.07, duration: 0.16, wave: "sine", gain: 0.1 },
  ],
  /** Réussite : arpège ascendant clair. */
  correct: [
    { frequency: DO5, duration: 0.1, wave: "triangle", gain: 0.11 },
    { frequency: MI5, offset: 0.06, duration: 0.1, wave: "triangle", gain: 0.11 },
    { frequency: SOL5, offset: 0.12, duration: 0.16, wave: "triangle", gain: 0.11 },
  ],
  /** Échec : deux notes basses descendantes. */
  wrong: [
    { frequency: 196, duration: 0.16, wave: "sawtooth", gain: 0.08 },
    { frequency: 147, offset: 0.1, duration: 0.22, wave: "sawtooth", gain: 0.08 },
  ],
  /** Fin de partie : arpège majeur complet. */
  finish: [
    { frequency: DO5, duration: 0.14, wave: "triangle", gain: 0.11 },
    { frequency: MI5, offset: 0.1, duration: 0.14, wave: "triangle", gain: 0.11 },
    { frequency: SOL5, offset: 0.2, duration: 0.14, wave: "triangle", gain: 0.11 },
    { frequency: DO6, offset: 0.3, duration: 0.28, wave: "triangle", gain: 0.12 },
  ],
};
