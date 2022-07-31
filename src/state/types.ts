import Element from '../dom/element';
export type ValueFn = () => ValueScalar;
export type ValueScalar = string | number | Date | null | undefined;
export type Value = ValueScalar | ValueFn;
export type KVP = {
  [key: string]: Value;
};

export type EventState = {
  name: string;
  handler: EventListenerOrEventListenerObject;
};

export type EventsState = {
  [id: string]: EventState;
};

export type Elements = {
  [id: string]: ElementState;
};

export type ElementState = {
  id: string;
  tagName: string;
  attributes?: KVP;
  classes?: string[];
  events?: EventsState;
  styles?: KVP;
  children?: Elements;
  text?: string;
  element?: Element;
};
