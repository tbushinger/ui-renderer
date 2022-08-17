import { Value } from '../dom/value-state';

export type Input = (...args: any) => Value<any>;
export type Output = (
  ...args: any
) => (e: EventListenerOrEventListenerObject) => void;

export type Registry = {
  [name: string]: Input | Output;
};
