export default class CssClass {
  private _element: HTMLElement;
  private _name: string;

  private constructor(element: HTMLElement, name: string) {
    this._element = element;
    this.set(name);
  }

  public get() {
    return this._name;
  }

  public set(name: string) {
    if (this._name === undefined || this._name !== name) {
      this._name = name;
      this._element.classList.add(this._name);
    }
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
