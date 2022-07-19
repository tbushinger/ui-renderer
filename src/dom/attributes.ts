import createAttribute, { Attribute } from './attribute';
import { Dictionary } from '../interfaces/dictionary';
import { Disposable } from '../interfaces/disposable';

type AttributeMap = {
  [key: string]: Attribute;
};

export class Attributes implements Dictionary<Attribute>, Disposable {
  private _element: HTMLElement;
  private _attributues: AttributeMap;

  constructor(element: HTMLElement, attributues?: AttributeMap) {
    this._element = element;
    this._attributues = attributues || {};
  }

  public add(key: string, value: any): Attributes {
    if (this.has(key)) {
      throw new Error(`Key ${key} already exists!`);
    }

    this._attributues[key] = createAttribute(this._element, key, value);

    return this;
  }

  public update(key: string, attribute: Attribute): Attributes {
    this._attributues[key] = attribute;
    return this;
  }

  public has(key: string): boolean {
    return this._attributues[key] !== undefined;
  }

  public remove(key: string): Attributes {
    if (!this.has(key)) {
      return this;
    }

    this._attributues[key].dispose();
    delete this._attributues[key];
  }

  public item(key: string): Attribute | null {
    if (!this.has(key)) {
      return null;
    }

    return this._attributues[key];
  }

  public forEach(callback: (key: string, attribute: Attribute) => void): void {
    Object.keys(this._attributues).forEach((key) => {
      callback(key, this._attributues[key]);
    });
  }

  public dispose(): void {
    this.forEach((key) => this.remove(key));
    this._attributues = undefined;
  }
}

export default function create(
  element: HTMLElement,
  attributues?: AttributeMap
): Attributes {
  return new Attributes(element, attributues);
}
