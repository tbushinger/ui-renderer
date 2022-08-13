import { Disposable, disposeObject } from '../utils/disposable';
import Style from './style';
import { Value } from './value-state';

type Fields = {
  element: HTMLElement;
  styles: Style[];
};

export default class Styles implements Disposable {
  private _fields: Fields;

  private constructor(element: HTMLElement) {
    this._fields = {
      element,
      styles: [],
    };
  }

  public add(key: string, value: Value<any>): Style {
    const style = Style.create(this._fields.element, key, value);
    this._fields.styles.push(style);
    return style;
  }

  public render(): Styles {
    this._fields.styles.forEach((style) => style.render());
    return this;
  }

  public isDisposed(): boolean {
    return this._fields === undefined;
  }

  public dispose(): void {
    disposeObject(this._fields, () =>
      this._fields.styles.forEach((s) => s.dispose())
    );
    this._fields = undefined;
  }

  public static create(element: HTMLElement): Styles {
    return new Styles(element);
  }
}
