import { Disposable, DisposableContainer } from '../utils/disposable';
import Id from '../utils/id';

const Keys = {
  element: 'element',
  id: 'id',
  name: 'name',
  handler: 'handler',
};

const createId = Id();

export default class Event implements Disposable {
  private _container: DisposableContainer;

  private constructor(
    element: HTMLElement,
    name: string,
    handler: EventListenerOrEventListenerObject
  ) {
    this._container = DisposableContainer.create(
      {
        element,
        name,
        handler,
        id: createId(),
      },
      (c) => {
        const elem: HTMLElement = c.get(Keys.element);
        const name: string = c.get(Keys.name);
        const _handler: EventListenerOrEventListenerObject = c.get(
          Keys.handler
        );

        elem.removeEventListener(name, _handler);
      }
    );

    element.addEventListener(name, handler);
  }

  public getId(): string {
    const id: string = this._container.get(Keys.id);
    return id;
  }

  public getName(): string {
    const name: string = this._container.get(Keys.name);
    return name;
  }

  public getHandler(): EventListenerOrEventListenerObject {
    const handler: EventListenerOrEventListenerObject = this._container.get(
      Keys.handler
    );
    return handler;
  }

  public isDisposed(): boolean {
    return this._container.isDisposed();
  }

  public dispose(): void {
    this._container.dispose();
  }

  public static create(
    element: HTMLElement,
    name: string,
    handler: any
  ): Event {
    return new Event(element, name, handler);
  }
}
