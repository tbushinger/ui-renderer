import CssClass from './cssClass';
import { Disposable, disposeObject } from '../utils/disposable';
import { Value } from './value-state';

type Fields = {
  element: HTMLElement;
  cssClasses: CssClass[];
};

export default class CssClasses implements Disposable {
  private _fields: Fields;

  private constructor(element: HTMLElement) {
    this._fields = {
      element,
      cssClasses: [],
    };
  }

  public add(name: Value<string>): CssClass {
    const cssClass = CssClass.create(this._fields.element, name);
    this._fields.cssClasses.push(cssClass);
    return cssClass;
  }

  public render(): CssClasses {
    this._fields.cssClasses.forEach((cssClass) => cssClass.render());
    return this;
  }

  public isDisposed(): boolean {
    return this._fields === undefined;
  }

  public dispose(): void {
    disposeObject(this._fields);
    this._fields = undefined;
  }

  public static create(element: HTMLElement): CssClasses {
    return new CssClasses(element);
  }
}
