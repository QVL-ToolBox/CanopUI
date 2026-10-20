export interface RecordedNote {
  wave: OscillatorType;
  frequency: number;
  start: number;
  stop: number;
  peak: number;
}

export interface RecordedBuffer {
  volume: number;
}

export interface FakeAudio {
  notes: RecordedNote[];
  buffers: RecordedBuffer[];
  created: number;
  resumed: number;
  closed: number;
  decodeCalls: number;
  restore: () => void;
}

export interface FakeAudioOptions {
  state?: AudioContextState;
  decodeFails?: boolean;
}

const SILENCE = 0.0001;

export function installFakeAudio(options: FakeAudioOptions = {}): FakeAudio {
  const audio: FakeAudio = {
    notes: [],
    buffers: [],
    created: 0,
    resumed: 0,
    closed: 0,
    decodeCalls: 0,
    restore: () => undefined,
  };

  class FakeParam {
    ramps: number[] = [];
    setValueAtTime(value: number) {
      this.ramps.push(value);
      return this;
    }
    exponentialRampToValueAtTime(value: number) {
      this.ramps.push(value);
      return this;
    }
    get peak(): number {
      const loud = this.ramps.filter((value) => value > SILENCE);
      return loud.length > 0 ? Math.max(...loud) : 0;
    }
  }

  class FakeGain {
    gain = new FakeParam();
    connect(target: unknown) {
      return target;
    }
  }

  class FakeOscillator {
    type: OscillatorType = "sine";
    frequency = new FakeParam();
    envelope: FakeGain | null = null;
    startedAt = 0;
    stoppedAt = 0;
    connect(target: FakeGain) {
      this.envelope = target;
      return target;
    }
    start(when: number) {
      this.startedAt = when;
    }
    stop(when: number) {
      this.stoppedAt = when;
      audio.notes.push({
        wave: this.type,
        frequency: this.frequency.ramps[0] ?? 0,
        start: this.startedAt,
        stop: when,
        peak: this.envelope?.gain.peak ?? 0,
      });
    }
  }

  class FakeBufferSource {
    buffer: unknown = null;
    level: FakeGain | null = null;
    connect(target: FakeGain) {
      this.level = target;
      return target;
    }
    start() {
      audio.buffers.push({ volume: this.level?.gain.peak ?? 0 });
    }
  }

  class FakeAudioContext {
    state: AudioContextState = options.state ?? "running";
    currentTime = 0;
    destination = {};

    constructor() {
      audio.created += 1;
    }

    createOscillator() {
      return new FakeOscillator();
    }

    createGain() {
      return new FakeGain();
    }

    createBufferSource() {
      return new FakeBufferSource();
    }

    decodeAudioData(bytes: ArrayBuffer) {
      audio.decodeCalls += 1;
      if (options.decodeFails) return Promise.reject(new Error("décodage impossible"));
      return Promise.resolve({ byteLength: bytes.byteLength } as unknown as AudioBuffer);
    }

    resume() {
      audio.resumed += 1;
      this.state = "running";
      return Promise.resolve();
    }

    close() {
      audio.closed += 1;
      this.state = "closed";
      return Promise.resolve();
    }
  }

  const scope = window as unknown as Record<string, unknown>;
  const previous = scope.AudioContext;
  scope.AudioContext = FakeAudioContext;
  audio.restore = () => {
    scope.AudioContext = previous;
  };

  return audio;
}

export function removeAudioContext(): () => void {
  const scope = window as unknown as Record<string, unknown>;
  const previousStandard = scope.AudioContext;
  const previousWebkit = scope.webkitAudioContext;
  delete scope.AudioContext;
  delete scope.webkitAudioContext;
  return () => {
    scope.AudioContext = previousStandard;
    scope.webkitAudioContext = previousWebkit;
  };
}
