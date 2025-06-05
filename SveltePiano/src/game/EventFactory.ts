type EventListener<T = any> = (data: T) => void;

export default class EventFactory {
  private _events: Record<string, EventListener[]> = {};

  constructor() {
    this._events = {};
  }

  on<T = any>(name: string, listener: EventListener<T>): void {
    if (!this._events[name]) {
      this._events[name] = [];
    }
    this._events[name].push(listener);
  }

  removeListener<T = any>(name: string, listenerToRemove: EventListener<T>): void {
    if (!this._events[name]) {
      throw new Error(`Can't remove a listener. Event "${name}" doesn't exist.`);
    }
    
    const filterListeners = (listener: EventListener) => listener !== listenerToRemove;
    this._events[name] = this._events[name].filter(filterListeners);
  }
  
  emit<T = any>(name: string, data?: T): void {
    const fireCallbacks = (callback: EventListener<T>) => {
      callback(data);
    };

    try {
      if (!this._events[name]) {
        throw new Error(`Can't emit an event. Event "${name}" doesn't exist.`);
      }
      this._events[name].forEach(fireCallbacks);
    } catch (error) {
      console.warn(error);
    }
  }
}
