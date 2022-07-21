import Event from './event';

export default class Events {
  private _element: HTMLElement;
  private _events: Event[];

  private constructor(element: HTMLElement, events?: Event[]) {
    this._element = element;
    this._events = events || [];
  }

  public forEach(
    callback: (event: Event) => boolean | undefined
  ): Event | undefined {
    let position = 0;
    while (position < this._events.length) {
      const event = this._events[position];
      const result = callback(event);

      if (result === true) {
        return event;
      }

      position++;
    }

    return undefined;
  }

  public getIn(
    name: string,
    handler: EventListenerOrEventListenerObject
  ): Event | undefined {
    return this.forEach((event) => {
      if (event.getName() === name && event.getHandler() === handler) {
        return true;
      }

      return undefined;
    });
  }

  public setIn(
    name: string,
    handler: EventListenerOrEventListenerObject
  ): Events {
    const existing = this.getIn(name, handler);
    if (existing) {
      return this;
    }

    this._events.push(Event.create(this._element, name, handler));

    return this;
  }

  public remove(match: (current: Event) => boolean): Events {
    const nextEvents = [];
    this.forEach((e) => {
      if (match(e)) {
        e.dispose();
      } else {
        nextEvents.push(e);
      }

      return undefined;
    });

    this._events = nextEvents;

    return this;
  }

  public removeByName(name: string): Events {
    return this.remove((e) => e.getName() === name);
  }

  public removeById(id: string): Events {
    return this.remove((e) => e.getId() === id);
  }

  public removeAll(): Events {
    return this.remove(() => true);
  }

  public dispose(): void {
    this.removeAll();
    this._events = undefined;
  }

  public static create(element: HTMLElement, events?: Event[]): Events {
    return new Events(element, events);
  }
}
