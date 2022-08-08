import { Disposable, disposeObject } from '../utils/disposable';
import Event from './event';

type Fields = {
  element: HTMLElement;
  events: Event[];
};

export default class Events implements Disposable {
  private _fields: Fields;

  private constructor(element: HTMLElement) {
    this._fields = {
      element,
      events: [],
    };
  }

  public add(name: string, handler: EventListenerOrEventListenerObject): Event {
    const event = Event.create(this._fields.element, name, handler);
    this._fields.events.push(event);
    return event;
  }

  public isDisposed(): boolean {
    return this._fields === undefined;
  }

  public dispose(): void {
    disposeObject(this._fields, () =>
      this._fields.events.forEach((e) => e.dispose())
    );
    this._fields = undefined;
  }

  public static create(element: HTMLElement): Events {
    return new Events(element);
  }
}
