import { Disposable, disposeObject } from '../utils/disposable';
import ValueState, { Scalar, Value } from './value-state';

type Fields = {
  element: HTMLElement;
  property: string;
  state: ValueState<any>;
};

function removeProperty(property: string, element: HTMLElement): void {
  if (element.style[property]) {
    element.style.removeProperty(property);
  }
}

export default class Style implements Disposable {
  private _fields: Fields;

  private constructor(
    element: HTMLElement,
    property: string,
    value: Value<any>
  ) {
    this._fields = {
      element,
      property,
      state: ValueState.create(value),
    };
  }

  public state(): ValueState<any> {
    return this._fields.state;
  }

  public render(): Style {
    const state = this.state();

    state.next((value: Scalar<any>, empty: boolean) => {
      const element = this._fields.element;
      const property = this._fields.property;

      if (empty) {
        removeProperty(property, element);
      } else {
        element.style[property] = value;
      }
    });

    return this;
  }

  public isDisposed(): boolean {
    return this._fields === undefined;
  }

  public dispose(): void {
    disposeObject(this._fields, () => {
      removeProperty(this._fields.property, this._fields.element);
    });
    this._fields = undefined;
  }

  public static create(
    element: HTMLElement,
    property: string,
    value: Value<any>
  ): Style {
    return new Style(element, property, value);
  }
}
