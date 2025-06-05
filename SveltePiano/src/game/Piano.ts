import { Piano } from '@tonejs/piano';

interface KeydownOptions {
  midi: number;
  velocity?: number;
}

interface KeyupOptions {
  midi: number;
  velocity?: number;
}

class PianoWrapper {
  private piano: Piano;

  constructor() {
    console.log(Piano);
    this.piano = new Piano({ velocities: 5 });
    console.log(this.piano);
    this.piano.toDestination();
    this.piano.output.gain.value = 0.1;
  }

  async load(): Promise<void> {
    return this.piano.load();
  }

  keyDown({ midi, velocity}: KeydownOptions): void {
    console.log('Key down:', midi, velocity);
    this.piano.keyDown({ midi, velocity });
  }

  keyUp({ midi, velocity}: KeyupOptions): void {
    this.piano.keyUp({ midi, velocity });
  }

  get loaded(): boolean {
    return this.piano.loaded;
  }

  setVolume(volume: number): void {
    this.piano.output.gain.value = Math.max(0, Math.min(1, volume));
  }
}

const piano = new PianoWrapper();

export default piano;
export type { KeydownOptions, KeyupOptions };