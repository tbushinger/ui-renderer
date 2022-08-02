import Attributes from '../dom/attributes';
import CssClasses from '../dom/cssClasses';
import Element, { Elements } from '../dom/element';
import Events from '../dom/events';
import Styles from '../dom/styles';
import { diffArray, diffKVP, resolveValue } from './utils';
import {
  Value,
  ValueScalar,
  EventState,
  KVP,
  EventsState,
  ElementState,
} from './types';
import { Disposable } from '../utils/disposable';

type StateVisitor = (context: any) => any;

type StateVisitors = {
  [type: string]: StateVisitor;
};

const visitors: StateVisitors = {
  attribute: (context: {
    key: string;
    value: Value;
    attributes: Attributes;
  }): Value => {
    const { attributes, key, value } = context;
    const resolved: ValueScalar = resolveValue(value);

    attributes.setIn(key, resolved);

    return value;
  },
  cssClass: (context: { name: string; cssClasses: CssClasses }): string => {
    const { name, cssClasses } = context;
    const resolved = resolveValue(name) as string;

    cssClasses.setIn(resolved);

    return name;
  },
  event: (context: {
    id: string;
    state: EventState;
    events: Events;
  }): EventState => {
    const { id, state, events } = context;
    const { name, handler } = state;
    const resolved = resolveValue(name) as string;

    events.setIn(resolved, handler, id);

    return {
      handler,
      name,
    };
  },
  style: (context: { prop: string; value: Value; styles: Styles }): Value => {
    const { prop, value, styles } = context;
    const resolved = resolveValue(value);

    styles.setIn(prop, resolved);

    return value;
  },
  attributes: (context: {
    prevAttributesState: KVP;
    newAttributesState: KVP;
    attributes: Attributes;
  }): KVP => {
    const { newAttributesState, prevAttributesState, attributes } = context;

    const updateAttribute = (key: string, value: Value): Value => {
      return visitors.attribute({ key, value, attributes });
    };

    return diffKVP(
      prevAttributesState,
      newAttributesState,
      updateAttribute,
      (key) => attributes.remove(key),
      updateAttribute
    );
  },
  cssClasses: (context: {
    prevClassesState: Value[];
    newClassesState: Value[];
    cssClasses: CssClasses;
  }): Value[] => {
    const { newClassesState, prevClassesState, cssClasses } = context;

    const updateClass = (name: Value): Value => {
      return visitors.cssClass({ name, cssClasses });
    };

    return diffArray(
      prevClassesState,
      newClassesState,
      updateClass,
      (name: string) => cssClasses.remove(name),
      updateClass
    );
  },
  events: (context: {
    prevEventsState: KVP;
    newEventsState: KVP;
    events: Events;
  }): EventsState => {
    const { newEventsState, prevEventsState, events } = context;

    const updateEvent: any = (id: string, state: EventState): EventState => {
      return visitors.event({ id, state, events });
    };

    return diffKVP(
      prevEventsState,
      newEventsState,
      updateEvent,
      (id) => events.remove(id),
      updateEvent
    ) as any;
  },
  styles: (context: {
    prevStylesState: KVP;
    newStylesState: KVP;
    styles: Styles;
  }): KVP => {
    const { newStylesState, prevStylesState, styles } = context;

    const updateStyle = (prop: string, value: Value): Value => {
      return visitors.style({ prop, value, styles });
    };

    return diffKVP(
      prevStylesState,
      newStylesState,
      updateStyle,
      (prop) => styles.remove(prop),
      updateStyle
    );
  },
  element: (context: {
    isNew: boolean;
    parent: string | HTMLElement;
    id: string;
    prevElementState: ElementState;
    newElementState: ElementState;
  }): ElementState => {
    const { isNew, id, parent, prevElementState, newElementState } = context;
    const { tagName, text } = newElementState;
    const { element: prevElement } = prevElementState;

    const element = isNew ? Element.create(parent, tagName, id) : prevElement;

    const resolvedText = resolveValue(text) as string;
    element.setText(resolvedText);

    const attributes = visitors.attributes({
      prevAttributesState: prevElementState.attributes,
      newAttributesState: newElementState.attributes,
      attributes: element.attributes(),
    });

    const classes = visitors.cssClasses({
      prevClassesState: prevElementState.classes,
      newClassesState: newElementState.classes,
      cssClasses: element.classes(),
    });

    const events = visitors.events({
      prevEventsState: prevElementState.events,
      newEventsState: newElementState.events,
      events: element.events(),
    });

    const styles = visitors.styles({
      prevStylesState: prevElementState.styles,
      newStylesState: newElementState.styles,
      styles: element.styles(),
    });

    const children = visitors.elements({
      parent: element.getDOMElement(),
      prevElementsState: prevElementState.children,
      newElementsState: newElementState.children,
      children: element.children(),
    });

    element.render();

    return {
      tagName,
      text,
      attributes,
      classes,
      events,
      element,
      styles,
      children,
      id: element.getId(),
    };
  },
  elements: (context: {
    parent: string | HTMLElement;
    prevElementsState: KVP;
    newElementsState: KVP;
    children: Elements;
  }): KVP => {
    const { parent, newElementsState, prevElementsState, children } = context;

    const addElement = (
      id: string,
      newElementState: ElementState
    ): ElementState => {
      const createdState: ElementState = visitors.element({
        parent,
        newElementState,
        id,
        isNew: true,
        prevElementState: {},
      });

      children.setIn(createdState.id, createdState.element);

      return createdState;
    };

    const updateElement = (
      id: string,
      newElementState: ElementState
    ): ElementState => {
      const prevElementState: ElementState = (prevElementsState as any)[id];

      return visitors.element({
        parent,
        newElementState,
        prevElementState,
        isNew: false,
      });
    };

    const removeElement = (id: string) => children.remove(id);

    return diffKVP(
      prevElementsState,
      newElementsState,
      addElement as any,
      removeElement,
      updateElement as any
    ) as any;
  },
};

export default class RenderEngine implements Disposable {
  private _elementState: ElementState;
  private _rootId: string;

  private constructor(rootId: string, initialElementState: ElementState) {
    this._rootId = rootId;
    this._elementState = visitors.element({
      isNew: true,
      parent: rootId,
      id: initialElementState.id,
      prevElementState: {},
      newElementState: initialElementState,
    });
  }

  public getState(): ElementState {
    return this._elementState;
  }

  public update(optionalElementState?: ElementState): ElementState {
    const newElementState = optionalElementState || this._elementState;
    this._elementState = visitors.element({
      newElementState,
      isNew: false,
      parent: this._rootId,
      id: newElementState.id,
      prevElementState: this._elementState,
    });

    return this._elementState;
  }

  public isDisposed(): boolean {
    return this._elementState.element.isDisposed();
  }

  public dispose(): void {
    this._elementState.element.dispose();
    this._elementState = undefined;
  }

  public static create(
    rootId: string,
    initialState: ElementState
  ): RenderEngine {
    return new RenderEngine(rootId, initialState);
  }
}
