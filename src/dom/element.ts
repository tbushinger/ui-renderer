import areEqual from '../utils/equal';
import Attributes from './attributes';
import CssClasses from './cssClasses';
import { Disposable, DisposableContainer } from '../utils/disposable';
import Events from './events';
import Id from '../utils/id';
import Styles from './styles';

const createId = Id();

const Keys = {
  parent: 'parent',
  element: 'element',
  tagName: 'tagName',
  text: 'text',
  id: 'id',
  attributes: 'attributes',
  events: 'events',
  cssClasses: 'cssClasses',
  styles: 'styles',
  appended: 'appended',
  children: 'children',
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
  private _container: DisposableContainer;

  private constructor(
    parentOrId: HTMLElement | string,
    tagName: string,
    optionalId?: string
  ) {
    const parent = getParent(parentOrId);
    const element = document.createElement(tagName);
    const id = optionalId || createId();

    this._container = DisposableContainer.create(
      {
        id,
        element,
        tagName,
        parent,
        attributes: Attributes.create(element),
        events: Events.create(element),
        cssClasses: CssClasses.create(element),
        styles: Styles.create(element),
        children: Elements.create(),
      },
      () => {
        parent.removeChild(element);
      }
    );

    this.attributes().setIn('id', id);
  }

  public getParentDOMElement(): HTMLElement {
    const parent: HTMLElement = this._container.get(Keys.parent);
    return parent;
  }

  public getDOMElement(): HTMLElement {
    const element: HTMLElement = this._container.get(Keys.element);
    return element;
  }

  public getId(): string {
    const id: string = this._container.get(Keys.id);
    return id;
  }

  public getText(): string {
    const text: string = this._container.get(Keys.text);
    return text;
  }

  public getTagName(): string {
    const tagName: string = this._container.get(Keys.tagName);
    return tagName;
  }

  public setText(text: string): Element {
    const container = this._container;
    if (areEqual(container.get(Keys.text), text)) {
      return this;
    }

    container.set(Keys.text, text);
    const element: HTMLElement = this._container.get(Keys.element);

    element.innerText = text;

    return this;
  }

  public attributes(): Attributes {
    const attributes: Attributes = this._container.get(Keys.attributes);
    return attributes;
  }

  public events(): Events {
    const events: Events = this._container.get(Keys.events);
    return events;
  }

  public classes(): CssClasses {
    const cssClasses: CssClasses = this._container.get(Keys.cssClasses);
    return cssClasses;
  }

  public styles(): Styles {
    const styles: Styles = this._container.get(Keys.styles);
    return styles;
  }

  public children(): Elements {
    const children: Elements = this._container.get(Keys.children);
    return children;
  }

  public addChild(
    tagName: string,
    setupChild: (child: Element) => Element = (c) => c,
    id?: string
  ): Element {
    const child = new Element(this.getDOMElement(), tagName, id);
    const updatedChild = setupChild(child);

    this.children().setIn(updatedChild.getId(), child);

    return this;
  }

  public render(): Element {
    const container = this._container;
    this.children().render();

    if (!container.get(Keys.appended)) {
      const parent = this.getParentDOMElement();
      const element = this.getDOMElement();

      parent.appendChild(element);

      container.set(Keys.appended, true);
    }

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
    tagName: string,
    value: any
  ): Element {
    return new Element(element, tagName, value);
  }
}

export type ElementMap = {
  [id: string]: Element;
};

const ElementsKeys = {
  elements: 'elements',
};

export class Elements implements Disposable {
  private _container: DisposableContainer;

  private constructor() {
    this._container = DisposableContainer.create(
      {
        elements: {},
      },
      () => {
        this.forEach((element) => element.dispose());
      }
    );
  }

  public setIn(id: string, element: Element): Elements {
    if (this.has(id)) {
      return this;
    }

    const elementMap: ElementMap = this._container.get(ElementsKeys.elements);

    elementMap[id] = element;

    return this;
  }

  public has(id: string): boolean {
    const elementMap: ElementMap = this._container.get(ElementsKeys.elements);
    return elementMap[id] !== undefined;
  }

  public remove(id: string): Elements {
    if (!this.has(id)) {
      return this;
    }

    const elementMap: ElementMap = this._container.get(ElementsKeys.elements);
    elementMap[id].dispose();

    delete elementMap[id];

    return this;
  }

  public getIn(id: string): Element | undefined {
    const elementMap: ElementMap = this._container.get(ElementsKeys.elements);
    return elementMap[id];
  }

  public forEach(callback: (element: Element) => void): void {
    const elementMap: ElementMap = this._container.get(ElementsKeys.elements);
    Object.values(elementMap).forEach(callback);
  }

  public render(): Elements {
    this.forEach((element) => element.render());
    return this;
  }

  public isDisposed(): boolean {
    return this._container.isDisposed();
  }

  public dispose(): void {
    this._container.dispose();
  }

  public static create(): Elements {
    return new Elements();
  }
}
