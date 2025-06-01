export class EventEmitter {
  private events: { [key: string]: ((data: any) => void)[] } = {};

  on(event: string, listener: (data: any) => void): void {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }

  emit(event: string, data?: any): void {
    const listeners = this.events[event];
    if (listeners) listeners.forEach(listener => listener(data));
  }

  get(event: string): any {
    return this.events[event]?.[0]?.(undefined);
  }
}