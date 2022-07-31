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
    elementOrId: string | Element;
    prevState: ElementState;
    newState: ElementState;
  }): ElementState => {
    const { isNew, elementOrId, parent, prevState, newState } = context;

    const element = isNew
      ? Element.create(parent, newState.tagName, elementOrId as string)
      : (elementOrId as Element);

    /*
    const elment = Element.create(parentOrId, 'div', undefined);
root.setText('Root');
root.attributes().setIn('title', 'Root element');
root.styles().setIn('color', 'navy').setIn('backgroundColor', 'lightgrey');

root.classes().setIn('container');

const eventId = root.events().setIn('click', (e) => {
  console.log('event id', eventId);
  console.log('Click from root ID:', e.target.id);
});
*/
  },
  // element
  // elements
  // root
};
