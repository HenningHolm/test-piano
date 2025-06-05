import Note from './Note';
import Engine from './Engine';
import { Container, Application } from 'pixi.js';
import Tracker from './Tracker';
import { Midi } from '@tonejs/midi';

interface MidiTrack {
  notes: any[];
}

interface MidiHeader {
  tempos: Array<{ bpm: number }>;

}

interface MidiData {
  durationTicks: number;
  tracks: MidiTrack[];
  header: MidiHeader;
}

export default class Song {
  public durationTicks: number;
  public header: MidiHeader;
  public name: string;
  public tempo: number;
  public tracks: MidiTrack[];
  public container: Container;
  public pixi: Application;
  public notes: Note[];
  public tracker: Tracker;

  constructor(mididata: Midi, name: string) {
    const { durationTicks, tracks, header } = mididata;
    this.durationTicks = durationTicks;
    this.header = header;
    this.name = name;
    this.tempo = header.tempos[0].bpm;
    this.tracks = tracks;
    this.container = new Container();
    this.pixi = Engine.instance!.pixi;

    tracks.forEach((track: MidiTrack, i: number) => {
      track.notes.forEach((note: any) => {
        this.container.addChild(new Note(note, i));
      });
    });

    this.notes = this.container.children as Note[];
    this.tracker = new Tracker(this);
    console.log('Song created', this);
  }

  set position(val: number) {
    this.container.y = val;
    this.tracker.cursor.x = (this.container.y - this.pixi.screen.height) * this.tracker.horizontalRatio;
  }

  get position(): number {
    return this.container.y;
  }

  reset(): void {
    this.position = 0;
    this.tracker.reset();
    this.notes.forEach((note: Note) => {
      note.particle.then(particle => {
        particle.emit = false;
      });
    });
  }
}

export type { MidiData, MidiTrack, MidiHeader };
