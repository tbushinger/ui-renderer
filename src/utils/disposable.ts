export interface Disposable {
  isDisposed: () => boolean;
  dispose: () => void;
}

type ValueMap = {
  [key: string]: any;
};

type OnDispose = (container: DisposableContainer) => void;

export class DisposableContainer implements Disposable {
  private _valueMap: ValueMap;
  private _onDispose: OnDispose;

  private constructor(valueMap: ValueMap, onDispose: OnDispose) {
    this._valueMap = valueMap;
    this._onDispose = onDispose;
  }

  public get<T>(key: string): T {
    return this._valueMap[key] as T;
  }

  public set<T>(key: string, value: T): DisposableContainer {
    this._valueMap[key] = value;
    return this;
  }

  public isDisposed(): boolean {
    return this._valueMap === undefined;
  }

  public dispose(): void {
    if (this.isDisposed()) {
      return;
    }

    this._onDispose(this);

    Object.keys(this._valueMap).forEach((key) => {
      const value = this._valueMap[key];

      if (value.dispose) {
        value.dispose();
      }

      delete this._valueMap[key];
    });

    this._valueMap = undefined;
  }

  public static create(
    valueMap: ValueMap,
    onDispose: OnDispose
  ): DisposableContainer {
    return new DisposableContainer(valueMap, onDispose);
  }
}
