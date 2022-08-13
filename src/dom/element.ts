import Attributes from './attributes';
import CssClasses from './cssClasses';
import { Disposable, disposeObject } from '../utils/disposable';
import Events from './events';
import Styles from './styles';
import ElementText from './text';
import { Value } from './value-state';

type Fields = {
  parent: HTMLElement;
  element: HTMLElement;
  tagName: string;
  text: ElementText;
  attributes: Attributes;
  events: Events;
  cssClasses: CssClasses;
  styles: Styles;
  appended: boolean;
  children: Elements;
};

function getParent(parentId: string | HTMLElement): HTMLElement {
  let parent: HTMLElement;
  if (typeof parentId === 'string') {
    parent = document.getElementById(parentId);

    if (!parent) {
      throw new Error(`Parent element ${parentId} not found!`);
    }

    return parent;
  }

  return parentId;
}

export default class Element implements Disposable {
  private _fields: Fields;

  private constructor(
    parentOrId: HTMLElement | string,
    tagName: string,
    text?: Value<string>
  ) {
    const parent = getParent(parentOrId);
    const element = document.createElement(tagName);

    this._fields = {
      parent,
      element,
      tagName,
      appended: false,
      text: ElementText.create(
        element,
        () => this._fields.children.size() > 0,
        text
      ),
      attributes: Attributes.create(element),
      events: Events.create(element),
      cssClasses: CssClasses.create(element),
      styles: Styles.create(element),
      children: Elements.create(),
    };
  }

  public text(): ElementText {
    return this._fields.text;
  }

  public attributes(): Attributes {
    return this._fields.attributes;
  }

  public events(): Events {
    return this._fields.events;
  }

  public classes(): CssClasses {
    return this._fields.cssClasses;
  }

  public styles(): Styles {
    return this._fields.styles;
  }

  public children(): Elements {
    return this._fields.children;
  }

  public addChild(tagName: string, text?: string): Element {
    const child = new Element(this._fields.element, tagName, text);

    this.children().add(child);

    return child;
  }

  public render(): Element {
    this.attributes().render();
    this.classes().render();
    this.styles().render();
    this.children().render();

    if (!this._fields.appended) {
      const parent = this._fields.parent;
      const element = this._fields.element;

      parent.appendChild(element);

      this._fields.appended = true;
    }

    return this;
  }

  public isDisposed(): boolean {
    return this._fields === undefined;
  }

  public dispose(): void {
    disposeObject(this._fields, () => {
      this.events().dispose();
      this.text().dispose();
      this.attributes().dispose();
      this.classes().dispose();
      this.styles().dispose();
      this.children().dispose();
    });
    this._fields = undefined;
  }

  public static create(
    parentOrId: HTMLElement | string,
    tagName: string,
    text?: Value<string>
  ): Element {
    return new Element(parentOrId, tagName, text);
  }
}

export class Elements implements Disposable {
  private _elements: Element[];

  private constructor() {
    this._elements = [];
  }

  public add(element: Element): Elements {
    this._elements.push(element);

    return this;
  }

  public size(): number {
    return this._elements.length;
  }

  public render(): Elements {
    this._elements.forEach((element) => element.render());
    return this;
  }

  public isDisposed(): boolean {
    return this._elements === undefined;
  }

  public dispose(): void {
    this._elements.forEach((element) => element.dispose());
  }

  public static create(): Elements {
    return new Elements();
  }
}
