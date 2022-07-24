import { Disposable, DisposableContainer } from '../utils/disposable';
import Event from './event';

const Keys = {
  element: 'element',
  eventMap: 'eventMap',
};

export type EventMap = {
  [id: string]: Event;
};

export default class Events implements Disposable {
  private _container: DisposableContainer;

  private constructor(element: HTMLElement) {
    this._container = DisposableContainer.create(
      {
        element,
        eventMap: {},
      },
      () => {
        this.forEach((event) => event.dispose());
      }
    );
  }

  public setIn(
    name: string,
    handler: EventListenerOrEventListenerObject,
    id?: string
  ): string {
    const container = this._container;
    if (id && this.has(id)) {
      return id;
    }

    const eventMap: EventMap = container.get(Keys.eventMap);
    const element: HTMLElement = container.get(Keys.element);

    const event = Event.create(element, name, handler);
    const newId = id || event.getId();
    eventMap[newId] = event;

    return newId;
  }

  public has(id: string): boolean {
    const eventMap: EventMap = this._container.get(Keys.eventMap);
    return eventMap[id] !== undefined;
  }

  public remove(id: string): Events {
    if (!this.has(id)) {
      return this;
    }

    const eventMap: EventMap = this._container.get(Keys.eventMap);
    const event: Event = eventMap[id];

    event.dispose();

    delete eventMap[id];

    return this;
  }

  public getIn(id: string): Event | undefined {
    const eventMap: EventMap = this._container.get(Keys.eventMap);
    return eventMap[id];
  }

  public forEach(callback: (event: Event) => void): void {
    const eventMap: EventMap = this._container.get(Keys.eventMap);
    Object.values(eventMap).forEach(callback);
  }

  public isDisposed(): boolean {
    return this._container.isDisposed();
  }

  public dispose(): void {
    this._container.dispose();
  }

  public static create(element: HTMLElement): Events {
    return new Events(element);
  }
}
