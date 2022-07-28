import areEqual from '../utils/equal';
import { Disposable, DisposableContainer } from '../utils/disposable';

const Keys = {
  element: 'element',
  prop: 'prop',
  value: 'value',
};

export default class Style implements Disposable {
  private _container: DisposableContainer;

  private constructor(element: HTMLElement, prop: string, value: any) {
    this._container = DisposableContainer.create(
      {
        element,
        prop,
      },
      (c) => {
        const elem: HTMLElement = c.get(Keys.element);
        const prop: string = c.get(Keys.prop);

        elem.style.removeProperty(prop);
      }
    );

    this.set(value);
  }

  public get(): any {
    const value = this._container.get(Keys.value);
    return value;
  }

  public set(value: any): Style {
    const container = this._container;
    if (areEqual(container.get(Keys.value), value)) {
      return this;
    }

    container.set(Keys.value, value);

    const element: HTMLElement = container.get(Keys.element);
    const prop: string = container.get(Keys.prop);

    element.style[prop] = value;

    return this;
  }

  public isDisposed(): boolean {
    return this._container.isDisposed();
  }

  public dispose(): void {
    this._container.dispose();
  }

  public static create(element: HTMLElement, prop: string, value: any): Style {
    return new Style(element, prop, value);
  }
}
