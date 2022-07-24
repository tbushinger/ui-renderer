import CssClass from './cssClass';
import { Disposable, DisposableContainer } from '../utils/disposable';

const Keys = {
  element: 'element',
  cssClassMap: 'cssClassMap',
};

export type CssClassMap = {
  [name: string]: CssClass;
};

export default class CssClasses implements Disposable {
  private _container: DisposableContainer;

  private constructor(element: HTMLElement) {
    this._container = DisposableContainer.create(
      {
        element,
        cssClassMap: {},
      },
      () => {
        this.forEach((cssClass) => cssClass.dispose());
      }
    );
  }

  public setIn(name: string): CssClasses {
    if (this.has(name)) {
      return this;
    }

    const container = this._container;
    const cssClassMap: CssClassMap = container.get(Keys.cssClassMap);
    const element: HTMLElement = container.get(Keys.element);

    cssClassMap[name] = CssClass.create(element, name);

    return this;
  }

  public has(name: string): boolean {
    const cssClassMap: CssClassMap = this._container.get(Keys.cssClassMap);
    return cssClassMap[name] !== undefined;
  }

  public remove(name: string): CssClasses {
    if (!this.has(name)) {
      return this;
    }

    const cssClassMap: CssClassMap = this._container.get(Keys.cssClassMap);
    const cssClass: CssClass = cssClassMap[name];

    cssClass.dispose();

    delete cssClassMap[name];

    return this;
  }

  public getIn(name: string): CssClass | undefined {
    const cssClassMap: CssClassMap = this._container.get(Keys.cssClassMap);
    return cssClassMap[name];
  }

  public forEach(callback: (cssClass: CssClass) => void): void {
    const cssClassMap: CssClassMap = this._container.get(Keys.cssClassMap);
    Object.values(cssClassMap).forEach(callback);
  }

  public isDisposed(): boolean {
    return this._container.isDisposed();
  }

  public dispose(): void {
    this._container.dispose();
  }

  public static create(element: HTMLElement): CssClasses {
    return new CssClasses(element);
  }
}
