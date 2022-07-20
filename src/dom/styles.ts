import Style from './style';

export type StyleMap = {
  [prop: string]: Style;
};

export default class Styles {
  private _element: HTMLElement;
  private _styles: StyleMap;

  private constructor(element: HTMLElement, styles?: StyleMap) {
    this._element = element;
    this._styles = styles || {};
  }

  public setIn(prop: string, value: any): Styles {
    if (this.has(prop)) {
      this.getIn(prop).set(value);
      return this;
    }

    this._styles[prop] = Style.create(this._element, prop, value);

    return this;
  }

  public has(prop: string): boolean {
    return this._styles[prop] !== undefined;
  }

  public remove(prop: string): Styles {
    if (!this.has(prop)) {
      return this;
    }

    this._styles[prop].dispose();

    delete this._styles[prop];
  }

  public getIn(prop: string): Style | undefined {
    return this._styles[prop];
  }

  public forEach(callback: (style: Style) => void): void {
    Object.values(this._styles).forEach(callback);
  }

  public dispose(): void {
    this.forEach((style) => style.dispose());
    this._styles = undefined;
  }

  public static create(element: HTMLElement, styles?: StyleMap): Styles {
    return new Styles(element, styles);
  }
}
