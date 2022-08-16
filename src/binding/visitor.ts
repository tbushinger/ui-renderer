import Attributes from '../dom/attributes';
import CssClasses from '../dom/cssClasses';
import Element from '../dom/element';
import Events from '../dom/events';
import Styles from '../dom/styles';
import { Value } from '../dom/value-state';
import { ElementMeta, EventMeta, KVP } from '../meta/types';



export class BinderVisitor {


  private attribute(
    attributes: Attributes,
    key: string,
    value: Value<any>
  ): void {
    attributes.add(key, value);
  }

  private attributes(element: Element, meta: KVP<any> = {}): void {
    const attributes = element.attributes();
    Object.keys(meta).forEach((key) =>
      this.attribute(attributes, key, meta[key])
    );
  }

  private cssClass(classes: CssClasses, name: Value<string>): void {
    classes.add(name);
  }

  private classes(element: Element, meta: Value<string>[] = []): void {
    const classes = element.classes();
    meta.forEach((name) => this.cssClass(classes, name));
  }

  private event(events: Events, meta: EventMeta): void {
    events.add(meta.name, meta.handler);
  }

  private events(element: Element, meta: EventMeta[] = []): void {
    const events = element.events();
    meta.forEach((eventMeta) => this.event(events, eventMeta));
  }

  private style(styles: Styles, key: string, value: Value<string>): void {
    styles.add(key, value);
  }

  private styles(element: Element, meta: KVP<any> = {}): void {
    const styles = element.styles();
    Object.keys(meta).forEach((key) => this.style(styles, key, meta[key]));
  }

  private element(
    parentOrId: Element | HTMLElement | string,
    meta: ElementMeta,
    isRoot: boolean = false
  ): Element {
    const element = isRoot
      ? Element.create(
          parentOrId as HTMLElement | string,
          meta.tagName,
          meta.text
        )
      : (parentOrId as Element).addChild(meta.tagName, meta.text);

    this.attributes(element, meta.attributes);
    this.classes(element, meta.classes);
    this.events(element, meta.events);
    this.styles(element, meta.styles);
    this.children(element, meta.children);

    return element;
  }

  private children(parent: Element, meta: ElementMeta[] = []): void {
    meta.forEach((elementMeta) => this.element(parent, elementMeta));
  }

  public visit(
    parentOrId: Element | HTMLElement | string,
    meta: ElementMeta
  ): Element {
    return this.element(parentOrId, meta, true);
  }

  public static create(): MetaVisitor {
    return new MetaVisitor();
  }
}
