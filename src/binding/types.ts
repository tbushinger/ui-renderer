import { Value } from "../dom/value-state";

export type InputFunction = (...args: any) => () => Value<any>;