import { Disposable, disposeObject } from '../utils/disposable';
import ValueState, { Scalar, Value } from './value-state';

type Fields = {
  element: HTMLElement;
  key: string;
  state: ValueState<string>;
};

function removeAttribute(key: string, element: HTMLElement): void {
  if (element.hasAttribute(key)) {
    element.removeAttribute(key);
  }
}

export default class Attribute implements Disposable {
  private _fields: Fields;

  private constructor(element: HTMLElement, key: string, value: Value<string>) {
    this._fields = {
      element,
      key,
      state: ValueState.create(value),
    };
  }

  public state(): ValueState<string> {
    return this._fields.state;
  }

  public render(): Attribute {
    const state = this.state();

    state.next((value: Scalar<string>, empty: boolean) => {
      const element = this._fields.element;
      const key = this._fields.key;

      if (empty) {
        removeAttribute(key, element);
      } else {
        element.setAttribute(key, value);
      }
    });

    return this;
  }

  public isDisposed(): boolean {
    return this._fields === undefined;
  }

  public dispose(): void {
    disposeObject(this._fields, () => {
      removeAttribute(this._fields.key, this._fields.element);
    });
    this._fields = undefined;
  }

  public static create(
    element: HTMLElement,
    key: string,
    value: Value<string>
  ): Attribute {
    return new Attribute(element, key, value);
  }
}
