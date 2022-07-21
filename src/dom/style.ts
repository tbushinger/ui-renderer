import areEqual from '../utils/equal';

export default class Style {
  private _element: HTMLElement;
  private _prop: string;
  private _value: any;

  private constructor(element: HTMLElement, prop: string, value: any) {
    this._element = element;
    this._prop = prop;
    this.set(value);
  }

  public get(): any {
    return this._value;
  }

  public set(value: any): Style {
    if (areEqual(this._value, value)) {
      return this;
    }

    this._value = value;
    this._element.style[this._prop] = this._value;

    return this;
  }

  public dispose(): void {
    this._element.style.removeProperty(this._prop);
    this._element = undefined;
    this._prop = undefined;
    this._value = undefined;
  }

  public static create(element: HTMLElement, prop: string, value: any): Style {
    return new Style(element, prop, value);
  }
}
