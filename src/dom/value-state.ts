import areEqual from '../utils/equal';
import { Disposable } from '../utils/disposable';
export type Expression<T> = () => Scalar<T>;
export type Scalar<T> = T | null | undefined;
export type Value<T> = Expression<T> | Scalar<T>;

export function isNil(value: any): boolean {
  return value === undefined || value === null;
}

export function isFunction<T>(value: Value<T>): boolean {
  return typeof value === 'function';
}

export default class ValueState<T> implements Disposable {
  private _resolveValue: Expression<T>;
  private _prevValue: Scalar<T>;

  private constructor(value: Value<T>) {
    if (isFunction(value)) {
      this._resolveValue = value as Expression<T>;
    } else {
      this._resolveValue = () => value as Scalar<T>;
    }
  }

  public value(): Scalar<T> {
    return this._prevValue;
  }

  public next(callback: (value: Scalar<T>, empty: boolean) => void): void {
    const value = this._resolveValue();

    const changed = !areEqual(value, this._prevValue);
    if (changed) {
      callback(value, isNil(value));
    }

    this._prevValue = value;
  }

  public isDisposed(): boolean {
    return this._resolveValue === undefined;
  }

  public dispose(): void {
    delete this._prevValue;
    delete this._resolveValue;
  }

  public static create<T>(value: Value<T>): ValueState<T> {
    return new ValueState(value);
  }
}
