export interface Disposable {
  isDisposed: () => boolean;
  dispose: () => void;
}

export function disposeObject(
  target: any,
  onDispose: () => void = () => null
): void {
  onDispose();

  Object.keys(target).forEach((key) => {
    const value = target[key];

    if (Array.isArray(value)) {
      value.forEach((item) => disposeObject(item));
    } else if (value.dispose) {
      value.dispose();
    }

    delete target[key];
  });
}
