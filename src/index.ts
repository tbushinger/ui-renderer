import { Input, Output } from './binding/types';
import { BinderVisitor } from './binding/visitor';
import { ElementMeta } from './meta/types';
import { MetaVisitor } from './meta/visitor';
import Element from './dom/element';
import { Disposable, disposeObject } from './utils/disposable';

type Fields = {
  metaVisitor: MetaVisitor;
  binderVisitor: BinderVisitor;
  target: string | HTMLElement;
  meta: ElementMeta;
  initRender: boolean;
  dom?: Element;
};

export class Application implements Disposable {
  private _fields: Fields;

  private constructor(target: string | HTMLElement, meta: ElementMeta) {
    this._fields = {
      target,
      meta,
      initRender: false,
      metaVisitor: MetaVisitor.create(),
      binderVisitor: BinderVisitor.create(),
    };
  }

  public registerFunction(name: string, fn: Input | Output): Application {
    this._fields.binderVisitor.registerBinding(name, fn);

    return this;
  }

  public registerModel(target: any): Application {
    this._fields.binderVisitor.registerBoundModel(target);

    return this;
  }

  public render(): Application {
    if (!this._fields.initRender) {
      const bound = this._fields.binderVisitor.visit(this._fields.meta);
      this._fields.dom = this._fields.metaVisitor.visit(
        this._fields.target,
        bound
      );
      this._fields.initRender = true;
    }

    this._fields.dom.render();

    return this;
  }

  public isDisposed(): boolean {
    return this._fields === undefined;
  }

  public dispose(): void {
    disposeObject(this._fields);
    this._fields = undefined;
  }

  public static create(
    target: string | HTMLElement,
    meta: ElementMeta
  ): Application {
    return new Application(target, meta);
  }
}
