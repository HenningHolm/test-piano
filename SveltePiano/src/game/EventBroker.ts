interface MusicEvents {
  'note-on': { midi: number; velocity?: number; octave: number; pitch: string }
  'note-off': { midi: number; octave: number; pitch: string }
  'tempo-change': { bpm: number }
  'song-loaded': { name: string; duration: number }
  'mode-change': { mode: string }
  'reset': {}
}

type EventName = keyof MusicEvents
type EventData<T extends EventName> = MusicEvents[T]
type EventListener<T extends EventName> = (data: EventData<T>) => void

class EventBroker {
  private static instance: EventBroker
  private listeners = new Map<EventName, EventListener<any>[]>()

  private constructor() {}

  static getInstance(): EventBroker {
    if (!EventBroker.instance) {
      EventBroker.instance = new EventBroker()
    }
    return EventBroker.instance
  }

  on<T extends EventName>(event: T, callback: EventListener<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    
    this.listeners.get(event)!.push(callback)

    return () => this.off(event, callback)
  }

  emit<T extends EventName>(event: T, data: EventData<T>): void {
    const callbacks = this.listeners.get(event) || []
    
    callbacks.forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in event listener for "${event}":`, error)
      }
    })
  }

  off<T extends EventName>(event: T, callback: EventListener<T>): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const filtered = callbacks.filter(cb => cb !== callback)
      this.listeners.set(event, filtered)
    }
  }
}

export const musicEvents = EventBroker.getInstance()
export const on = musicEvents.on.bind(musicEvents)
export const emit = musicEvents.emit.bind(musicEvents)
export const off = musicEvents.off.bind(musicEvents)