import { interpolateMagma } from 'd3-scale-chromatic';
import { scaleSequential } from 'd3-scale';
import { color } from 'd3-color';
import { Sprite, Texture } from 'pixi.js';
import Engine from './Engine';
import FireParticle from './FireParticle';
import { musicEvents } from './EventBroker';

const LOWEST_KEY = 24;
const OCTAVE_AMOUNT = 7;
const colorScale = scaleSequential()
  .domain([24, OCTAVE_AMOUNT * 12])
  .interpolator(interpolateMagma);
const keysToBePressed = new Set<number>();

interface MidiNote {
  midi: number;
  durationTicks: number;
  ticks: number;
}

export default class Note extends Sprite {
  public note: MidiNote;
  public midi: number;
  public engine: Engine;
  public pixi: any;
  public w: number;
  public h: number;
  public hand: 'left' | 'right';
  public isNoteOn: boolean;
  public isPlayed: boolean;
  public hitPosition: number;
  public defaultColor: string;
  public disabledColor: number;
  public noteOnColor: number;
  public particle: Promise<any>;

  constructor(note: MidiNote, i: number) {
    super(Texture.WHITE);
    this.note = note;
    const { midi, durationTicks, ticks } = note;
    this.midi = midi;
    this.engine = Engine.instance!;
    this.pixi = Engine.instance!.pixi;
    this.w = this.pixi.screen.width / OCTAVE_AMOUNT / 12;
    this.h = durationTicks;
    this.hand = i === 1 ? 'left' : 'right';
    this.x = (midi - LOWEST_KEY + 1) * this.w;
    this.y = -ticks;
    this.isNoteOn = false;
    this.isPlayed = false;
    this.hitPosition = 0;
    this.anchor.set(1, 1);
    this.defaultColor = color(colorScale(this.note.midi))!.formatHex();
    this.disabledColor = 0x8b95a6;
    this.noteOnColor = 0x2f329f;
    this.tint = this.defaultColor;
    this.particle = new FireParticle(
      this.engine.emitterContainer, 
      { pos: { x: this.x - this.w, y: this.pixi.screen.height } }, 
      this.defaultColor
    );
    this.particle.then(particle => {
      particle.emit = false;
    });
  }

  update(hitPosition: number): void {
    // We have to set the width and height in here, otherwise it does not work somehow...
    this.width = this.w;
    this.height = this.h;
    this.hitPosition = hitPosition;
    if (this.noteOffCheck()) this.noteOff();
    if (this.noteOnCheck()) {
      this.noteOn();
      this.pickMode();
    }
    this.handEnableCheck() ? this.tint = this.defaultColor : this.tint = this.disabledColor;
  }

  noteOnCheck(): boolean {
    return (
      this.hitPosition <= this.position.y &&
      this.hitPosition >= this.position.y - this.height &&
      this.handEnableCheck()
    );
  }

  noteOffCheck(): boolean {
    return this.position.y - this.height >= this.hitPosition;
  }

  noteOn(): void {
    if (!this.isNoteOn) {
      this.tint = this.noteOnColor;
      const { midi } = this.note;
      
      // Send kun MIDI - lean event
      musicEvents.emit('note-on', { midi });
      this.isNoteOn = true;
    }
    this.particle.then(particle => {
      particle.emit = true;
    });
  }

  noteOff(): void {
    if (!this.isNoteOn) return;
    const { midi } = this.note;
    
    // Send kun MIDI - lean event  
    musicEvents.emit('note-off', { midi });
    this.isNoteOn = false;
    this.particle.then(particle => {
      particle.emit = false;
    });
  }

  handEnableCheck(): boolean {
    return (
      (this.engine.leftHand && this.hand === 'left') ||
      (this.engine.rightHand && this.hand === 'right')
    );
  }

  pickMode(): void {
    if (this.engine.mode === 'waitInput' && !this.engine.keysBeingPressed.has(this.note.midi)) {
      keysToBePressed.add(this.note.midi);
      console.log(this.engine.keysBeingPressed);
      this.engine.pause();
    }
  }
}

export { colorScale, keysToBePressed };