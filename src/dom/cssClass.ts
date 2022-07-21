import areEqual from '../utils/equal';

export default class CssClass {
  private _element: HTMLElement;
  private _name: string;

  private constructor(element: HTMLElement, name: string) {
    this._element = element;
    this.set(name);
  }

  public get(): string {
    return this._name;
  }

  public set(name: string): CssClass {
    if (areEqual(this._name, name)) {
      return this;
    }

    this._name = name;
    this._element.classList.add(this._name);

    return this;
  }

  public dispose(): void {
    this._element.classList.remove(this._name);
    this._element = undefined;
    this._name = undefined;
  }

  public static create(element: HTMLElement, name: string): CssClass {
    return new CssClass(element, name);
  }
}
