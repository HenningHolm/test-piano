import { readFile } from '../utils/helpers';
import { Application } from 'pixi.js';
import Engine from './Engine';

interface InitializeOptions {
  antialias?: boolean;
  resizeTo?: HTMLCanvasElement;
}

export default async function initialize(
  view: HTMLCanvasElement, 
  options: InitializeOptions = {}
): Promise<Engine> {
  const app = new Application();
  
  await app.init({
    antialias: true,
    canvas: view,
    resizeTo: view,
    ...options
  });

  const engine = new Engine(app);
  
  try {
    const fileName = 'ConcerningHobbits.midi';
    const midiFile = await readFile(fileName);
    engine.placeSong(midiFile, fileName);
  } catch (error) {
    console.warn('Could not load default MIDI file:', error);
  }

  return engine;
}

export type { InitializeOptions };