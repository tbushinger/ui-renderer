import { Disposable, disposeObject } from '../utils/disposable';
import ValueState, { Scalar, Value } from './value-state';

type Fields = {
  element: HTMLElement;
  hasChildren: () => boolean;
  state: ValueState<string>;
};

export default class ElementText implements Disposable {
  private _fields: Fields;

  private constructor(
    element: HTMLElement,
    hasChildren: () => boolean,
    value: Value<string>
  ) {
    this._fields = {
      element,
      hasChildren,
      state: ValueState.create(value),
    };
  }

  public state(): ValueState<string> {
    return this._fields.state;
  }

  public render(): ElementText {
    const state = this.state();

    state.next((value: Scalar<string>, empty: boolean) => {
      const element = this._fields.element;
      const hasChildren = this._fields.hasChildren();

      if (hasChildren) {
        throw new Error(
          'Setting text on elements with children is not allowed!'
        );
      }

      element.innerText = empty ? '' : value;
    });

    return this;
  }

  public isDisposed(): boolean {
    return this._fields === undefined;
  }

  public dispose(): void {
    disposeObject(this._fields);
    this._fields = undefined;
  }

  public static create(
    element: HTMLElement,
    hasChildren: () => boolean,
    value: Value<string>
  ): ElementText {
    return new ElementText(element, hasChildren, value);
  }
}
