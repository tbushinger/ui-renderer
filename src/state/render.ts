import Attribute from '../dom/attribute';
import CssClass from '../dom/cssClass';
import Event from '../dom/event';
import { resolveValue } from './utils';
import { Value, ValueScalar, EventState } from './types';

type VisitorState = {
  next: any;
  prev: any;
  context: any;
};

type StateVisitor = (state: VisitorState, next?: StateVisitor) => any;

type StateVisitors = {
  [type: string]: StateVisitor;
};

const visitors: StateVisitors = {
  attribute: (state) => {
    const attribute: Attribute = state.context;
    const value: Value = state.next;
    const resolved: ValueScalar = resolveValue(value);

    return attribute.set(resolved).get();
  },
  /*
  cssClass: (state) => {
    const cssClass: CssClass = state.context;
    const value: Value = state.next;
    const resolved: ValueScalar = resolveValue(value);

    return cssClass.set(resolved as string).get();
  },
  event: (state) => {
    const { context, next } = state;
    const event: Event = context;
    const eventState: EventState = next;
    
    return event.
  },*/
};
