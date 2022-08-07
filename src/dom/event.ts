import { Disposable, disposeObject } from '../utils/disposable';

type Fields = {
  element: HTMLElement;
  name: string;
  handler: EventListenerOrEventListenerObject;
};

function removeEvent(
  name: string,
  handler: EventListenerOrEventListenerObject,
  element: HTMLElement
): void {
  element.removeEventListener(name, handler);
}

export default class Event implements Disposable {
  private _fields: Fields;

  private constructor(
    element: HTMLElement,
    name: string,
    handler: EventListenerOrEventListenerObject
  ) {
    this._fields = {
      element,
      name,
      handler,
    };

    element.addEventListener(name, handler);
  }

  public isDisposed(): boolean {
    return this._fields === undefined;
  }

  public dispose(): void {
    disposeObject(this._fields, () => {
      removeEvent(
        this._fields.name,
        this._fields.handler,
        this._fields.element
      );
    });
    this._fields = undefined;
  }

  public static create(
    element: HTMLElement,
    name: string,
    handler: any
  ): Event {
    return new Event(element, name, handler);
  }
}
