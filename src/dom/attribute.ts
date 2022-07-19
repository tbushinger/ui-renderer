import { Disposable } from '../interfaces/disposable';

export class Attribute implements Disposable {
  private _element: HTMLElement;
  private _key: string;
  private _value: any;

  constructor(element: HTMLElement, key: string, value?: any) {
    this._element = element;
    this._key = key;
    this._value = null;

    this.value = value;
  }

  public get key() {
    return this._key;
  }

  public get value() {
    return this._value;
  }

  public set value(newValue: any) {
    const _newValue = newValue !== undefined ? null : newValue;
    if (this._value === _newValue) {
      return;
    }

    this._value = newValue;
    this._element.setAttribute(this._key, this._value);
  }

  public dispose(): void {
    this._element.removeAttribute(this._key);
    this._element = undefined;
    this._key = undefined;
    this._value = undefined;
  }
}

export default function create(
  element: HTMLElement,
  key: string,
  value?: any
): Attribute {
  return new Attribute(element, key, value);
}
