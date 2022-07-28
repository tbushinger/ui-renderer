import areEqual from '../utils/equal';
import { Disposable, DisposableContainer } from '../utils/disposable';

const Keys = {
  element: 'element',
  name: 'name',
};

export default class CssClass implements Disposable {
  private _container: DisposableContainer;

  private constructor(element: HTMLElement, name: string) {
    this._container = DisposableContainer.create(
      {
        element,
      },
      (c) => {
        const elem: HTMLElement = c.get(Keys.element);
        const name: string = c.get(Keys.name);

        elem.classList.remove(name);
      }
    );

    this.set(name);
  }

  public get(): string {
    const name: string = this._container.get(Keys.name);
    return name;
  }

  public set(name: string): CssClass {
    const container = this._container;

    if (areEqual(container.get(Keys.name), name)) {
      return this;
    }

    container.set(Keys.name, name);

    const elem: HTMLElement = container.get(Keys.element);
    elem.classList.add(name);

    return this;
  }

  public isDisposed(): boolean {
    return this._container.isDisposed();
  }

  public dispose(): void {
    this._container.dispose();
  }

  public static create(element: HTMLElement, name: string): CssClass {
    return new CssClass(element, name);
  }
}
