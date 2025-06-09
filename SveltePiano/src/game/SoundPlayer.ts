import { Piano as TonejsPiano } from '@tonejs/piano';

interface KeydownOptions {
  midi: number;
  velocity?: number;
}

interface KeyupOptions {
  midi: number;
  velocity?: number;
}

class SoundPlayer {
  private tonejsPiano: TonejsPiano;

  constructor() {
    console.log(TonejsPiano);
    this.tonejsPiano = new TonejsPiano({ velocities: 5 });
    console.log(this.tonejsPiano);
    this.tonejsPiano.toDestination();
    this.tonejsPiano.output.gain.value = 0.1;
  }

  async load(): Promise<void> {
    return this.tonejsPiano.load();
  }

  triggerDown({ midi, velocity}: KeydownOptions): void {
    console.log('Key down:', midi, velocity);
    this.tonejsPiano.keyDown({ midi, velocity });
  }

  triggerUp({ midi, velocity}: KeyupOptions): void {
    this.tonejsPiano.keyUp({ midi, velocity });
  }

  get loaded(): boolean {
    return this.tonejsPiano.loaded;
  }

  setVolume(volume: number): void {
    this.tonejsPiano.output.gain.value = Math.max(0, Math.min(1, volume));
  }
}

const soundplayer = new SoundPlayer();

export default soundplayer;
export type { KeydownOptions, KeyupOptions };