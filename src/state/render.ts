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
    prevState: KVP;
    newState: KVP;
    attributes: Attributes;
  }): KVP => {
    const { newState, prevState, attributes } = context;

    const visitAttribute = (key: string, value: Value): Value => {
      return visitors.attribute({ key, value, attributes });
    };

    return diffKVP(
      prevState,
      newState,
      visitAttribute,
      (key) => attributes.remove(key),
      visitAttribute
    );
  },
  CssClasses: (context: {
    prevState: Value[];
    newState: Value[];
    cssClasses: CssClasses;
  }): Value[] => {
    const { newState, prevState, cssClasses } = context;

    const visitClass = (name: Value): Value => {
      return visitors.cssClass({ name, cssClasses });
    };

    return diffArray(
      prevState,
      newState,
      visitClass,
      (name: string) => cssClasses.remove(name),
      visitClass
    );
  },
  events: (context: {
    prevState: KVP;
    newState: KVP;
    events: Events;
  }): EventsState => {
    const { newState, prevState, events } = context;

    const visitEvent: any = (id: string, state: EventState): EventState => {
      return visitors.event({ id, state, events });
    };

    return diffKVP(
      prevState,
      newState,
      visitEvent,
      (id) => events.remove(id),
      visitEvent
    ) as any;
  },
  styles: (context: { prevState: KVP; newState: KVP; styles: Styles }): KVP => {
    const { newState, prevState, styles } = context;

    const visitStyle = (prop: string, value: Value): Value => {
      return visitors.style({ prop, value, styles });
    };

    return diffKVP(
      prevState,
      newState,
      visitStyle,
      (prop) => styles.remove(prop),
      visitStyle
    );
  },
  element: (context: {
    isNew: boolean;
    parent: string | HTMLElement;
    id: string;
    prevState: ElementState;
    newState: ElementState;
  }): ElementState => {
    const { isNew, id, parent, prevState, newState } = context;
    const { tagName, text } = newState;
    const { element: prevElement } = prevState;

    const element = isNew
      ? Element.create(parent, tagName, id as string)
      : prevElement;

    const resolvedText = resolveValue(text) as string;
    element.setText(resolvedText);

    const attributes = visitors.attributes({
      prevState: prevState.attributes,
      newState: newState.attributes,
      attributes: element.attributes(),
    });

    const classes = visitors.cssClasses({
      prevState: prevState.classes,
      newState: newState.classes,
      cssClasses: element.classes(),
    });

    const events = visitors.events({
      prevState: prevState.events,
      newState: newState.events,
      events: element.events(),
    });

    const styles = visitors.styles({
      prevState: prevState.styles,
      newState: newState.styles,
      Styles: element.events(),
    });

    const children = visitors.elements({
      parent: element,
      prevState: prevState.children,
      newState: newState.children,
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
    prevState: KVP;
    newState: KVP;
    children: Elements;
  }): KVP => {
    const { parent, newState, prevState, children } = context;

    const addElement = (
      id: string,
      newElementState: ElementState
    ): ElementState => {
      const createdState: ElementState = visitors.element({
        parent,
        newState: newElementState,
        elementOrId: id,
        isNew: true,
        prevState: {},
      });

      children.setIn(createdState.id, createdState.element);

      return createdState;
    };

    const updateElement = (
      id: string,
      newElementState: ElementState
    ): ElementState => {
      const prevElementState: ElementState = (prevState as any)[id];

      return visitors.element({
        parent,
        newState: newElementState,
        elementOrId: prevElementState.element,
        isNew: false,
        prevState: prevElementState,
      });
    };

    const removeElement = (id: string) => children.remove(id);

    return diffKVP(
      prevState,
      newState,
      addElement as any,
      removeElement,
      updateElement as any
    ) as any;
  },
};

export default class RenderEngine implements Disposable {
  private _state: ElementState;
  private _rootId: string;

  private constructor(rootId: string, initialState: ElementState) {
    this._rootId = rootId;
    this._state = visitors.element({
      isNew: true,
      parent: rootId,
      id: initialState.id,
      prevState: {},
      newState: initialState
    });
  }

  public update(optionalState?: ElementState): ElementState {
    const newState = optionalState || this._state;
    this._state = visitors.element({
      newState,
      isNew: false,
      parent: this._rootId,
      id: newState.id,
      prevState: this._state, 
    });

    return this._state;
  }

  public isDisposed(): boolean {
    return this._state.element.isDisposed();
  }

  public dispose(): void {
    this._state.element.dispose();
    this._state = undefined;
  }

}