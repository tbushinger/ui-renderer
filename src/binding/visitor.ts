import Attributes from '../dom/attributes';
import CssClasses from '../dom/cssClasses';
import Element from '../dom/element';
import Events from '../dom/events';
import Styles from '../dom/styles';
import { Value } from '../dom/value-state';
import { ElementMeta, EventMeta, KVP } from '../meta/types';
import { Input, Output, Registry } from './types';

export class BinderVisitor {
  private registry: Registry = {};

  private bind(value: Value<any>) {
    if (typeof value !== 'string') {
      return value;
    }

    if (!value.startsWith('@')) {
      return value;
    }

    const [_prefix, name, ...params] = value.split(/\s|@/);

    const fn = this.registry[name];
    if (!fn) {
      throw new Error(`Annotation "${name}" not registered!`);
    }

    return fn(...params);
  }

  private attributes(meta: KVP<any> = {}): KVP<any> {
    return Object.keys(meta).reduce((acc, key) => {
      acc[key] = this.bind(meta[key]);
      return acc;
    }, meta);
  }

  private classes(meta: Value<string>[] = []): Value<string>[] {
    return meta.map((name) => this.bind(name));
  }

  private events(meta: EventMeta[] = []): EventMeta[] {
    return meta.map((eventMeta) => {
      return {
        name: eventMeta.name,
        handler: this.bind(eventMeta.handler),
      };
    });
  }

  private styles(meta: KVP<any> = {}): KVP<any> {
    return Object.keys(meta).reduce((acc, key) => {
      acc[key] = this.bind(meta[key]);
      return acc;
    }, meta);
  }

  private element(meta: ElementMeta): ElementMeta {
    return Object.assign({}, meta, {
      text: this.bind(meta.text),
      attributes: this.attributes(meta.attributes),
      classes: this.classes(meta.classes),
      events: this.events(meta.events),
      styles: this.styles(meta.styles),
      children: this.children(meta.children),
    });
  }

  private children(meta: ElementMeta[] = []): ElementMeta[] {
    return meta.map((elementMeta) => this.element(elementMeta));
  }

  public visit(meta: ElementMeta): ElementMeta {
    return this.element(meta);
  }

  public registerBinding(name: string, fn: Input | Output): BinderVisitor {
    this.registry[name] = fn;
    return this;
  }

  public registerBoundModel(target: any): BinderVisitor {
    Object.keys(target).forEach((key) => {
      this.registerBinding(key, target[key]);
    });
    return this;
  }

  public static create(): BinderVisitor {
    return new BinderVisitor();
  }
}
