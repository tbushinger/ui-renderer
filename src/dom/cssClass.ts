import { Disposable, disposeObject } from '../utils/disposable';
import ValueState, { Scalar, Value } from './value-state';

type Fields = {
  element: HTMLElement;
  state: ValueState<string>;
};

function removeClass(name: string, element: HTMLElement): void {
  if (name && element.classList.contains(name)) {
    element.classList.remove(name);
  }
}

export default class CssClass implements Disposable {
  private _fields: Fields;

  private constructor(element: HTMLElement, name: Value<string>) {
    this._fields = {
      element,
      state: ValueState.create(name),
    };
  }

  public state(): ValueState<string> {
    return this._fields.state;
  }

  public render(): CssClass {
    const state = this.state();

    state.next((name: Scalar<string>, empty: boolean) => {
      const element = this._fields.element;

      if (empty) {
        removeClass(state.value(), element);
      } else {
        element.classList.add(name);
      }
    });

    return this;
  }

  public isDisposed(): boolean {
    return this._fields === undefined;
  }

  public dispose(): void {
    disposeObject(this._fields, () => {
      removeClass(this.state().value(), this._fields.element);
    });
    this._fields = undefined;
  }

  public static create(element: HTMLElement, name: Value<string>): CssClass {
    return new CssClass(element, name);
  }
}
