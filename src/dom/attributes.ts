import Attribute from './attribute';
import { Disposable, disposeObject } from '../utils/disposable';
import { Value } from './value-state';

type Fields = {
  element: HTMLElement;
  attributes: Attribute[];
};

export default class Attributes implements Disposable {
  private _fields: Fields;

  private constructor(element: HTMLElement) {
    this._fields = {
      element,
      attributes: [],
    };
  }

  public add(key: string, value: Value<string>): Attribute {
    const attribute = Attribute.create(this._fields.element, key, value);
    this._fields.attributes.push(attribute);
    return attribute;
  }

  public render(): Attributes {
    this._fields.attributes.forEach((attribute) => attribute.render());
    return this;
  }

  public isDisposed(): boolean {
    return this._fields === undefined;
  }

  public dispose(): void {
    disposeObject(this._fields);
    this._fields = undefined;
  }

  public static create(element: HTMLElement): Attributes {
    return new Attributes(element);
  }
}
