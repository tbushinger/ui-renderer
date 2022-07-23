import areEqual from '../utils/equal';
import Attributes from './attributes';
import CssClasses from './cssClasses';
import Events from './events';
import Id from '../utils/id';
import Styles from './styles';

const createId = Id();

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

export default class Element {
  private _parent: HTMLElement;
  private _element: HTMLElement;
  private _tagName: string;
  private _text: string;
  private _id: string;
  private _attributes: Attributes;
  private _events: Events;
  private _cssClasses: CssClasses;
  private _styles: Styles;
  private _appended: boolean;
  private _children: Elements;

  private constructor(
    parent: HTMLElement | string,
    tagName: string,
    id?: string
  ) {
    this._parent = getParent(parent);
    this._tagName = tagName;
    this._id = id || createId();
    this._element = document.createElement(tagName);
    this._attributes = Attributes.create(this._element);
    this._events = Events.create(this._element);
    this._cssClasses = CssClasses.create(this._element);
    this._styles = Styles.create(this._element);
    this._children = Elements.create();

    this.attributes().setIn('id', id);
  }

  public getParentDOMElement(): HTMLElement {
    return this._parent;
  }

  public getDOMElement(): HTMLElement {
    return this._element;
  }

  public getId(): string {
    return this._id;
  }

  public getText(): string {
    return this._text;
  }

  public getTagName(): string {
    return this._tagName;
  }

  public setText(text: string): Element {
    if (areEqual(this._text, text)) {
      return this;
    }

    this._text = text;
    this._element.innerText = this._text;

    return this;
  }

  public attributes(): Attributes {
    return this._attributes;
  }

  public events(): Events {
    return this._events;
  }

  public classes(): CssClasses {
    return this._cssClasses;
  }

  public styles(): Styles {
    return this._styles;
  }

  public children(): Elements {
    return this._children;
  }

  public addChild(tagName: string, setupChild: (child: Element) => Element = c => c, id?: string): Element {
    const child = new Element(this.getDOMElement(), tagName, id);
    const updatedChild = setupChild(child);

    this.children().setIn(updatedChild.getId(), child);

    return this;
  }

  public render(): Element {
    this.children().render();

    if (!this._appended) {
      this._parent.appendChild(this._element);
      this._appended = true;
    }

    return this;
  }

  public dispose(): void {
    this.children().dispose();
    this.attributes().dispose();
    this.events().dispose();
    this.classes().dispose();
    this.styles().dispose();
    
    this._id = undefined;
    this._tagName = undefined;
    this._text = undefined;
    this._attributes = undefined;
    this._events = undefined;
    this._cssClasses = undefined;
    this._styles = undefined;
    this._children = undefined;
    this._appended = undefined;

    this.getParentDOMElement().removeChild(this.getDOMElement());
    this._element = undefined;
    this._parent = undefined;
  }

  public static create(
    element: HTMLElement,
    tagName: string,
    value: any
  ): Element {
    return new Element(element, tagName, value);
  }
}

export type ElementMap = {
  [id: string]: Element;
};

export class Elements {
  private _elements: ElementMap;

  private constructor() {
    this._elements = {};
  }

  public setIn(id: string, element: Element): Elements {
    if (this.has(id)) {
      return this;
    }

    this._elements[id] = element;

    return this;
  }

  public has(id: string): boolean {
    return this._elements[id] !== undefined;
  }

  public remove(id: string): Elements {
    if (!this.has(id)) {
      return this;
    }

    this._elements[id].dispose();

    delete this._elements[id];

    return this;
  }

  public getIn(id: string): Element | undefined {
    return this._elements[id];
  }

  public forEach(callback: (element: Element) => void): void {
    Object.values(this._elements).forEach(callback);
  }

  public render(): Elements {
    this.forEach((element) => element.render());
    return this;
  }

  public dispose(): void {
    this.forEach((element) => element.dispose());
    this._elements = undefined;
  }

  public static create(): Elements {
    return new Elements();
  }
}
