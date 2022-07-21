import areEqual from '../utils/equal';

export default class Attribute {
  private _element: HTMLElement;
  private _key: string;
  private _value: any;

  private constructor(element: HTMLElement, key: string, value: any) {
    this._element = element;
    this._key = key;
    this.set(value);
  }

  public get(): any {
    return this._value;
  }

  public set(value: any): Attribute {
    if (areEqual(this._value, value)) {
      return this;
    }

    this._value = value;
    this._element.setAttribute(this._key, this._value);

    return this;
  }

  public dispose(): void {
    this._element.removeAttribute(this._key);
    this._element = undefined;
    this._key = undefined;
    this._value = undefined;
  }

  public static create(
    element: HTMLElement,
    key: string,
    value: any
  ): Attribute {
    return new Attribute(element, key, value);
  }
}
