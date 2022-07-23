import areEqual from '../utils/equal';
import Attributes from './attributes';
import CssClasses from './cssClasses';
import Events from './events';
import Id from '../utils/id';
import Styles from './styles';

const createId = Id();

function getTarget(targetId: string | HTMLElement): HTMLElement {
  let target: HTMLElement;
  if (typeof targetId === 'string') {
    target = document.getElementById(targetId);

    if (!target) {
      throw new Error(`Target element ${targetId} not found!`);
    }

    return target;
  }

  return targetId;
}

export default class Element {
  private _target: HTMLElement;
  private _element: HTMLElement;
  private _tagName: string;
  private _text: string;
  private _id: string;
  private _attributes: Attributes;
  private _events: Events;
  private _cssClasses: CssClasses;
  private _styles: Styles;
  private _appended: boolean;

  private constructor(
    target: HTMLElement | string,
    tagName: string,
    id?: string
  ) {
    this._target = getTarget(target);
    this._tagName = tagName;
    this._id = id || createId();
    this._element = document.createElement(tagName);
    this._attributes = Attributes.create(this._element);
    this._events = Events.create(this._element);
    this._cssClasses = CssClasses.create(this._element);
    this._styles = Styles.create(this._element);

    this.attributes().setIn('id', id);
  }

  public getId(): string {
    return this._id;
  }

  public getText(): string {
    return this._text;
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

  public render(): Element {
    if (!this._appended) {
      this._target.appendChild(this._element);
    }

    return this;
  }

  // here
  // children

  public dispose(): void {
    this._element.removeElement(this._tagName);
    this._element = undefined;
    this._tagName = undefined;
    this._value = undefined;
  }

  public static create(
    element: HTMLElement,
    tagName: string,
    value: any
  ): Element {
    return new Element(element, tagName, value);
  }
}
