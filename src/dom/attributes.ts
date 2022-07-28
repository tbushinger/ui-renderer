import Attribute from './attribute';
import { Disposable, DisposableContainer } from '../utils/disposable';

const Keys = {
  element: 'element',
  attributeMap: 'attributeMap',
};

export type AttributeMap = {
  [key: string]: Attribute;
};

export default class Attributes implements Disposable {
  private _container: DisposableContainer;

  private constructor(element: HTMLElement) {
    this._container = DisposableContainer.create(
      {
        element,
        attributeMap: {},
      },
      () => {
        this.forEach((attribute) => attribute.dispose());
      }
    );
  }

  public setIn(key: string, value: any): Attributes {
    const container = this._container;
    if (this.has(key)) {
      this.getIn(key).set(value);
      return this;
    }

    const attributeMap: AttributeMap = container.get(Keys.attributeMap);
    const element: HTMLElement = container.get(Keys.element);

    attributeMap[key] = Attribute.create(element, key, value);

    return this;
  }

  public has(key: string): boolean {
    const attributeMap: AttributeMap = this._container.get(Keys.attributeMap);
    return attributeMap[key] !== undefined;
  }

  public remove(key: string): Attributes {
    if (!this.has(key)) {
      return this;
    }

    const attributeMap: AttributeMap = this._container.get(Keys.attributeMap);
    const attribute: Attribute = attributeMap[key];

    attribute.dispose();

    delete attributeMap[key];

    return this;
  }

  public getIn(key: string): Attribute | undefined {
    const attributeMap: AttributeMap = this._container.get(Keys.attributeMap);
    return attributeMap[key];
  }

  public forEach(callback: (attribute: Attribute) => void): void {
    const attributeMap: AttributeMap = this._container.get(Keys.attributeMap);
    Object.values(attributeMap).forEach(callback);
  }

  public isDisposed(): boolean {
    return this._container.isDisposed();
  }

  public dispose(): void {
    this._container.dispose();
  }

  public static create(element: HTMLElement): Attributes {
    return new Attributes(element);
  }
}
