import { Disposable, DisposableContainer } from '../utils/disposable';
import ValueState, { Scalar, Value } from './value-state';

const Keys = {
  element: 'element',
  key: 'key',
  state: 'state',
};

function removeAttribute(key: string, element: HTMLElement): void {
  if (element.hasAttribute(key)) {
    element.removeAttribute(key);
  }
}

export default class Attribute implements Disposable {
  private _container: DisposableContainer;

  private constructor(element: HTMLElement, key: string, value: Value<string>) {
    this._container = DisposableContainer.create(
      {
        element,
        key,
      },
      (c) => {
        const elem: HTMLElement = c.get(Keys.element);
        const key: string = c.get(Keys.key);

        removeAttribute(key, elem);
      }
    );

    this._container.set(Keys.state, ValueState.create(value));
  }

  public state(): ValueState<string> {
    return this._container.get(Keys.state) as ValueState<string>;
  }

  public render(): Attribute {
    const container = this._container;
    const state = this.state();

    state.next((value: Scalar<string>, empty: boolean) => {
      const element: HTMLElement = container.get(Keys.element);
      const key: string = container.get(Keys.key);

      if (empty) {
        removeAttribute(key, element);
      } else {
        element.setAttribute(key, value);
      }
    });

    return this;
  }

  public isDisposed(): boolean {
    return this._container.isDisposed();
  }

  public dispose(): void {
    this._container.dispose();
  }

  public static create(
    element: HTMLElement,
    key: string,
    value: any
  ): Attribute {
    return new Attribute(element, key, value);
  }
}
