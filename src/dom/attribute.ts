import areEqual from '../utils/equal';
import { Disposable, DisposableContainer } from '../utils/disposable';

const Keys = {
  element: 'element',
  key: 'key',
  value: 'value',
};

export default class Attribute implements Disposable {
  private _container: DisposableContainer;

  private constructor(element: HTMLElement, key: string, value: any) {
    this._container = DisposableContainer.create(
      {
        element,
        key,
      },
      (c) => {
        const elem: HTMLElement = c.get(Keys.element);
        const key: string = c.get(Keys.key);

        elem.removeAttribute(key);
      }
    );

    this.set(value);
  }

  public get(): any {
    return this._container.get(Keys.value);
  }

  public set(value: any): Attribute {
    const container = this._container;

    if (areEqual(container.get(Keys.value), value)) {
      return this;
    }

    container.set(Keys.value, value);

    const element: HTMLElement = container.get(Keys.element);
    const key: string = container.get(Keys.key);

    element.setAttribute(key, value);

    return this;
  }

  public isDisposed(): boolean {
    return this._container.isDisposed();
  }

  public dispose(): void {
    this._container.dispose();
  }

  public static create(
    element: HTMLElement,
    key: string,
    value: any
  ): Attribute {
    return new Attribute(element, key, value);
  }
}
