import Attributes from '../dom/attributes';
import CssClasses from '../dom/cssClasses';
import Events from '../dom/events';
import Style from '../dom/style';
import Styles from '../dom/styles';
import { diffArray, diffKVP, resolveValue } from './utils';
import { Value, ValueScalar, EventState, KVP } from './types';

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

    return attributes.setIn(key, resolved).getIn(key).get();
  },
  cssClass: (context: { name: string; cssClasses: CssClasses }): string => {
    const { name, cssClasses } = context;
    const resolved = resolveValue(name) as string;

    return cssClasses.setIn(resolved).getIn(resolved).get();
  },
  event: (context: {
    name: string;
    handler: EventListenerOrEventListenerObject;
    optionalId?: string;
    events?: Events;
  }): { id: string; eventState: EventState } => {
    const { name, handler, optionalId, events } = context;
    const resolved = resolveValue(name) as string;
    const id = events.setIn(resolved, handler, optionalId);

    return {
      id,
      eventState: {
        handler,
        name: resolved,
      },
    };
  },
  style: (context: {
    prop: string;
    value: Value;
    isNew: boolean;
    styles?: Styles;
    style?: Style;
  }): Value => {
    const { prop, value, isNew, styles, style } = context;
    const resolved = resolveValue(value);

    if (isNew) {
      return styles.setIn(prop, resolved).getIn(prop).get();
    }

    return style.set(resolved).get();
  },
  attributes: (context: {
    prevState: KVP;
    newState: KVP;
    attributes?: Attributes;
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
  // events
  // styles
  // element
  // elements
};
