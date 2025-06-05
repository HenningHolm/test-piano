import { Container, Graphics, Sprite, Texture, FederatedPointerEvent, Application } from 'pixi.js';
import Engine from './Engine';
import drag from './drag';
import Note from './Note';
import Song from './Song';

export default class Tracker {
  public trackerHeight: number;
  public framePadding: number;
  public song: Song;
  public cursor: Sprite;
  public horizontalRatio: number;
  public verticalRatio: number;
  public pixi: Application;
  public engine: Engine;
  public container: Container;
  public dragObjects: [Sprite, Sprite, Graphics] | null;
  public isDragging: boolean;
  public minX: number;

  constructor(song: Song) {
    this.trackerHeight = Engine.instance!.pixi.screen.height / 8;
    this.framePadding = 10;
    this.song = song;
    this.cursor = new Sprite(Texture.WHITE);
    this.horizontalRatio = window.innerWidth / song.durationTicks;
    this.verticalRatio = this.getVerticalRatio();
    this.pixi = Engine.instance!.pixi;
    this.engine = Engine.instance!;
    this.container = new Container();
    this.container.addChild(
      ...song.notes.map((note: Note) => this.generateTrackerSprite(note)),
      this.generateCursor(),
      this.generateFrame()
    );
    this.dragObjects = null;
    this.enableListener();
    this.isDragging = false;
  }

  getVerticalRatio(): number {
    const availableMidiNotes = this.song.notes.map((note: Note) => note.x);
    const min = Math.min(...availableMidiNotes);
    this.minX = min;
    const max = Math.max(...availableMidiNotes);
    return this.trackerHeight / (max - min);
  }

  scaleX(x: number): number {
    return (x - this.minX) * this.verticalRatio;
  }

  generateTrackerSprite(note: Note): Sprite {
    const rect = Sprite.from(Texture.WHITE);
    rect.width = note.h * this.horizontalRatio;
    rect.height = note.w * this.verticalRatio;
    rect.tint = 'gray';
    rect.x = -note.y * this.horizontalRatio;
    rect.y = this.scaleX(note.x);
    return rect;
  }

  generateCursor(): Sprite {
    this.cursor.width = 2;
    this.cursor.height = this.trackerHeight + this.framePadding;
    this.cursor.tint = 0xffffff;
    this.cursor.x = -this.pixi.screen.height * this.horizontalRatio;
    return this.cursor;
  }

  generateFrame(): Sprite {
    const graphics = new Graphics()
      .moveTo(0, 0)
      .lineTo(0, this.trackerHeight + this.framePadding)
      .stroke({ color: 'black', width: 1 })
      .lineTo(this.pixi.screen.width, this.trackerHeight + this.framePadding)
      .stroke({ color: 'gray', width: 1 });

    const frame = this.pixi.renderer.generateTexture({
      target: graphics,
      resolution: window.devicePixelRatio
    });
    
    const sprite = new Sprite(frame);
    return sprite;
  }

  enableListener(): void {
    this.container.interactive = true;
    this.container.cursor = 'pointer';
    this.dragObjects = drag(this);
    
    this.container.on('pointertap', (e: FederatedPointerEvent) => {
      if (this.isDragging) return;
      const cursorPosition = e.getLocalPosition(this.container).x;
      const songPosition = cursorPosition / this.horizontalRatio + this.pixi.screen.height;
      this.song.position = songPosition;
      this.cursor.x = cursorPosition;
      this.pixi.render();
    });
  }

  reset(): void {
    if (this.dragObjects) {
      this.container.removeChild(...this.dragObjects);
    }
    this.container.alpha = 1;
  }
}
