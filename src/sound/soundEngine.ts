import {
  canopSoundRecipes,
  type CanopSoundName,
  type CanopSoundNote,
  type CanopSoundRecipe,
} from "./soundRecipes";

/**
 * Ce qu'il est réellement advenu d'une demande de lecture.
 *
 * Exposé, et non journalisé : un son qui ne sort pas est invisible, donc
 * indébogable. C'est la même leçon que la vidéo du fond animé, où un échec de
 * décodage silencieux avait coûté une session entière.
 */
export type CanopSoundOutcome = "file" | "synth" | "muted" | "unavailable";

export interface CanopPlayOptions {
  muted?: boolean;
  /** Volume général, de 0 à 1, appliqué par-dessus le volume de la recette. */
  volume?: number;
}

export interface CanopSoundEngineOptions {
  /** Remplace tout ou partie du catalogue synthétisé. */
  recipes?: Partial<Record<CanopSoundName, CanopSoundRecipe>>;
  /**
   * Fichiers audio à utiliser à la place de la synthèse, par son.
   *
   * Un fichier absent, refusé ou indécodable **ne rend jamais l'application
   * muette** : la synthèse reprend la main, et l'échec n'est tenté qu'une fois.
   */
  sources?: Partial<Record<CanopSoundName, string>>;
}

export interface CanopSoundEngine {
  play(name: CanopSoundName, options?: CanopPlayOptions): CanopSoundOutcome;
  /** Précharge les fichiers déclarés. Sans effet quand il n'y en a aucun. */
  preload(): Promise<void>;
  /**
   * Crée et réveille le contexte audio.
   *
   * À appeler depuis un geste de l'utilisateur : les navigateurs suspendent
   * tout contexte créé sans interaction, et un contexte suspendu joue dans le
   * vide sans lever d'erreur.
   */
  unlock(): void;
  dispose(): void;
}

type AudioContextConstructor = new () => AudioContext;

function audioContextConstructor(): AudioContextConstructor | null {
  if (typeof window === "undefined") return null;
  const scope = window as unknown as {
    AudioContext?: AudioContextConstructor;
    webkitAudioContext?: AudioContextConstructor;
  };
  return scope.AudioContext ?? scope.webkitAudioContext ?? null;
}

function clampVolume(value: number | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 1;
  return Math.min(Math.max(value, 0), 1);
}

const SILENCE = 0.0001;
const ATTACK = 0.012;
const RELEASE_MARGIN = 0.03;

export function createSoundEngine(options: CanopSoundEngineOptions = {}): CanopSoundEngine {
  const recipes = { ...canopSoundRecipes, ...options.recipes };
  const sources = { ...options.sources };

  let ctx: AudioContext | null = null;
  const buffers = new Map<CanopSoundName, AudioBuffer>();
  const pending = new Set<CanopSoundName>();
  const refusedNeverRetried = new Set<CanopSoundName>();

  function context(): AudioContext | null {
    const Ctor = audioContextConstructor();
    if (!Ctor) return null;
    if (!ctx) ctx = new Ctor();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }

  async function loadSource(name: CanopSoundName): Promise<void> {
    const src = sources[name];
    if (!src || buffers.has(name) || refusedNeverRetried.has(name) || pending.has(name)) return;
    const target = context();
    if (!target) return;
    pending.add(name);
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`${response.status}`);
      const bytes = await response.arrayBuffer();
      buffers.set(name, await target.decodeAudioData(bytes));
    } catch {
      refusedNeverRetried.add(name);
    } finally {
      pending.delete(name);
    }
  }

  function playNote(target: AudioContext, note: CanopSoundNote, volume: number): void {
    const oscillator = target.createOscillator();
    const envelope = target.createGain();
    const start = target.currentTime + (note.offset ?? 0);
    const peak = Math.max((note.gain ?? 0.12) * volume, SILENCE);

    oscillator.type = note.wave ?? "sine";
    oscillator.frequency.setValueAtTime(note.frequency, start);
    envelope.gain.setValueAtTime(SILENCE, start);
    envelope.gain.exponentialRampToValueAtTime(peak, start + ATTACK);
    envelope.gain.exponentialRampToValueAtTime(SILENCE, start + note.duration);

    oscillator.connect(envelope).connect(target.destination);
    oscillator.start(start);
    oscillator.stop(start + note.duration + RELEASE_MARGIN);
  }

  function playBuffer(target: AudioContext, buffer: AudioBuffer, volume: number): void {
    const source = target.createBufferSource();
    const level = target.createGain();
    source.buffer = buffer;
    level.gain.setValueAtTime(volume, target.currentTime);
    source.connect(level).connect(target.destination);
    source.start();
  }

  return {
    play(name, playOptions = {}) {
      if (playOptions.muted) return "muted";
      const target = context();
      if (!target) return "unavailable";

      const volume = clampVolume(playOptions.volume);
      const buffer = buffers.get(name);
      if (buffer) {
        playBuffer(target, buffer, volume);
        return "file";
      }

      if (sources[name] && !refusedNeverRetried.has(name)) void loadSource(name);

      const recipe = recipes[name];
      if (!recipe) return "unavailable";
      for (const note of recipe) playNote(target, note, volume);
      return "synth";
    },

    async preload() {
      await Promise.all((Object.keys(sources) as CanopSoundName[]).map(loadSource));
    },

    unlock() {
      context();
    },

    dispose() {
      buffers.clear();
      pending.clear();
      refusedNeverRetried.clear();
      void ctx?.close();
      ctx = null;
    },
  };
}
