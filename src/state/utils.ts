import { Value, ValueScalar } from './types';

export function resolveValue(value: Value): ValueScalar {
  if (typeof value === 'function') {
    return value();
  }

  return value;
}
