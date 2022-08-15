import { Value } from '../dom/value-state';

export type KVP<T> = {
  [key: string]: Value<T>;
};

export type EventMeta = {
  name: string;
  handler: EventListenerOrEventListenerObject;
};

export type ElementMeta = {
  tagName: string;
  attributes?: KVP<any>;
  classes?: Value<string>[];
  events?: EventMeta[];
  styles?: KVP<string>;
  text?: Value<string>;
  children?: ElementMeta[];
};
