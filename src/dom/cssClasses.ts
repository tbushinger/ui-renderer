import CssClass from './cssClass';

export type CssClassMap = {
  [name: string]: CssClass;
};

export default class CssClasses {
  private _element: HTMLElement;
  private _cssClasses: CssClassMap;

  private constructor(element: HTMLElement, cssClasses?: CssClassMap) {
    this._element = element;
    this._cssClasses = cssClasses || {};
  }

  public setIn(name: string): CssClasses {
    if (this.has(name)) {
      return this;
    }

    this._cssClasses[name] = CssClass.create(this._element, name);

    return this;
  }

  public has(name: string): boolean {
    return this._cssClasses[name] !== undefined;
  }

  public remove(name: string): CssClasses {
    if (!this.has(name)) {
      return this;
    }

    this._cssClasses[name].dispose();

    delete this._cssClasses[name];
  }

  public getIn(name: string): CssClass | undefined {
    return this._cssClasses[name];
  }

  public forEach(callback: (cssClass: CssClass) => void): void {
    Object.values(this._cssClasses).forEach(callback);
  }

  public dispose(): void {
    this.forEach((cssClass) => cssClass.dispose());
    this._cssClasses = undefined;
  }

  public static create(
    element: HTMLElement,
    cssClasses?: CssClassMap
  ): CssClasses {
    return new CssClasses(element, cssClasses);
  }
}
