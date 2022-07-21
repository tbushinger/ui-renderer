import areEqual from '../utils/equal';
import Id from '../utils/id';

const createId = Id();

export default class Event {
  private _element: HTMLElement;
  private _id: string;
  private _name: string;
  private _handler: EventListenerOrEventListenerObject;

  private constructor(
    element: HTMLElement,
    name: string,
    handler: EventListenerOrEventListenerObject
  ) {
    this._element = element;
    this.set(name, handler);
  }

  public getId(): string {
    return this._id;
  }

  public getName(): string {
    return this._name;
  }

  public getHandler(): EventListenerOrEventListenerObject {
    return this._handler;
  }

  public set(name: string, handler: EventListenerOrEventListenerObject): Event {
    if (areEqual(this._handler, handler) && areEqual(this._name, name)) {
      return this;
    }

    this._id = createId();
    this._name = name;
    this._handler = handler;

    this._element.addEventListener(this._name, this._handler);

    return this;
  }

  public dispose(): void {
    this._element.removeEventListener(this._name, this._handler);
    this._element = undefined;
    this._id = undefined;
    this._name = undefined;
    this._handler = undefined;
  }

  public static create(
    element: HTMLElement,
    name: string,
    handler: any
  ): Event {
    return new Event(element, name, handler);
  }
}
