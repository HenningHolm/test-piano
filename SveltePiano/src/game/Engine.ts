import { Container, Application } from 'pixi.js'
import { bpm2px } from '../utils/helpers'
import Song from './Song'
import EventFactory from './EventFactory'

export default class Engine extends EventFactory {
  static instance: Engine | null = null
  
  pixi: Application
  song: Song | null = null
  tempo: number | null = null
  leftHand: boolean = true
  rightHand: boolean = true
  mode: string = 'playAlong'
  keysBeingPressed: Set<number> = new Set()
  loopFunc: (() => void) | null = null
  emitterContainer: Container

  constructor(app: Application) {
    if (Engine.instance == null) {
      super()
      this.pixi = app
      Engine.instance = this
      this.pixi.ticker.add(() => this.gameLoop())
      this.emitterContainer = new Container()
    }
    return Engine.instance
  }

  placeSong(midi: any, fileName: string): void {
    console.log('placing the song')
    this.pause()
    this.pixi.stage.removeChildren()
    this.song = new Song(midi, fileName)
    this.pixi.stage.addChild(this.song.tracker.container)
    this.pixi.stage.addChild(this.song.container)
    this.pixi.stage.addChild(this.emitterContainer)
    this.tempo = this.song.tempo
    this.emit('tempoChange', Math.round(this.tempo))
    this.pixi.render()
  }

  start(): void { 
    this.pixi.ticker.start()
  }

  pause(): void {
    this.pixi.ticker.stop()
  }

  stop(): void {
    this.pause()
    this.song?.reset()
    window.dispatchEvent(new CustomEvent('reset'))
    this.pixi.render()
  }

  enableLooping(limits: { min: number, max: number }, callback: () => void): void {
    console.log('enabling looping', limits)
    window.dispatchEvent(new CustomEvent('reset'))
    if (this.song) this.song.position = limits.min
    if (this.loopFunc) this.pixi.ticker.remove(this.loopFunc)
    this.loopFunc = () => this.loopInArea(limits, callback)
    this.pixi.ticker.add(this.loopFunc)
  }

  disableLooping(): void {
    console.log('disabling looping')
    if (this.loopFunc) this.pixi.ticker.remove(this.loopFunc)
  }

  loopInArea(limits: { min: number, max: number }, callback: () => void): void {
    if (this.song && this.song.position >= limits.max) {
      this.song.position = limits.min
      callback()
      window.dispatchEvent(new CustomEvent('reset'))
    }
  }

  stepForward(): void {
    window.dispatchEvent(new CustomEvent('reset'))
    if (this.song) this.song.position += 240
    this.pixi.render()
  }

  stepBackward(): void {
    window.dispatchEvent(new CustomEvent('reset'))
    if (this.song) this.song.position -= 240
    this.pixi.render()
  }

  tempoChange(tempo: number): void {
    this.tempo = Number(tempo)
  }

  updateMode(mode: string): void {
    this.mode = mode
  }

  gameLoop(): void {
    if (!this.song || !this.tempo) return
    
    this.song.position += bpm2px(this.tempo, this.pixi.ticker.deltaMS)
    const hitPosition = -this.song.position + this.pixi.screen.height
    
    for (let i = this.song.notes.length - 1; i >= 0; i -= 1) {
      const note = this.song.notes[i]
      note.update(hitPosition)
    }
  }
}
