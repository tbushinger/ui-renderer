import Attribute from './attribute';

export type AttributeMap = {
  [key: string]: Attribute;
};

export default class Attributes {
  private _element: HTMLElement;
  private _attributes: AttributeMap;

  private constructor(element: HTMLElement, attributes?: AttributeMap) {
    this._element = element;
    this._attributes = attributes || {};
  }

  public setIn(key: string, value: any): Attributes {
    if (this.has(key)) {
      this.getIn(key).set(value);
      return this;
    }

    this._attributes[key] = Attribute.create(this._element, key, value);

    return this;
  }

  public has(key: string): boolean {
    return this._attributes[key] !== undefined;
  }

  public remove(key: string): Attributes {
    if (!this.has(key)) {
      return this;
    }

    this._attributes[key].dispose();

    delete this._attributes[key];
  }

  public getIn(key: string): Attribute | undefined {
    return this._attributes[key];
  }

  public forEach(callback: (attribute: Attribute) => void): void {
    Object.values(this._attributes).forEach(callback);
  }

  public dispose(): void {
    this.forEach((attribute) => attribute.dispose());
    this._attributes = undefined;
  }

  public static create(element: HTMLElement, attributes?: AttributeMap): Attributes {
    return new Attributes(element, attributes);
  }
}
