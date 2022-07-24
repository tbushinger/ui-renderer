import { Disposable, DisposableContainer } from '../utils/disposable';
import Style from './style';

const Keys = {
  element: 'element',
  styleMap: 'styleMap',
};

export type StyleMap = {
  [prop: string]: Style;
};

export default class Styles implements Disposable {
  private _container: DisposableContainer;

  private constructor(element: HTMLElement) {
    this._container = DisposableContainer.create(
      {
        element,
        styleMap: {},
      },
      () => {
        this.forEach((style) => style.dispose());
      }
    );
  }

  public setIn(prop: string, value: any): Styles {
    const container = this._container;
    if (this.has(prop)) {
      this.getIn(prop).set(value);
      return this;
    }

    const styleMap: StyleMap = container.get(Keys.styleMap);
    const element: HTMLElement = container.get(Keys.element);

    styleMap[prop] = Style.create(element, prop, value);

    return this;
  }

  public has(prop: string): boolean {
    const styleMap: StyleMap = this._container.get(Keys.styleMap);
    return styleMap[prop] !== undefined;
  }

  public remove(prop: string): Styles {
    if (!this.has(prop)) {
      return this;
    }

    const styleMap: StyleMap = this._container.get(Keys.styleMap);
    const style: Style = styleMap[prop];

    style.dispose();

    delete styleMap[prop];

    return this;
  }

  public getIn(prop: string): Style | undefined {
    const styleMap: StyleMap = this._container.get(Keys.styleMap);
    return styleMap[prop];
  }

  public forEach(callback: (style: Style) => void): void {
    const styleMap: StyleMap = this._container.get(Keys.styleMap);
    Object.values(styleMap).forEach(callback);
  }

  public isDisposed(): boolean {
    return this._container.isDisposed();
  }

  public dispose(): void {
    this._container.dispose();
  }

  public static create(element: HTMLElement): Styles {
    return new Styles(element);
  }
}
