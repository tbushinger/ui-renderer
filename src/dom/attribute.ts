export default class Attribute {
  private _element: HTMLElement;
  private _key: string;
  private _value: any;

  private constructor(element: HTMLElement, key: string, value: any) {
    this._element = element;
    this._key = key;
    this.set(value);
  }

  public get() {
    return this._value;
  }

  public set(value: any) {
    if (this._value === undefined || this._value !== value) {
      this._value = value;
      this._element.setAttribute(this._key, this._value);
    }
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
