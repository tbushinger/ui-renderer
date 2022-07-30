import { KVP, Value, ValueScalar } from './types';

export function resolveValue(value: Value): ValueScalar {
  if (typeof value === 'function') {
    return value();
  }

  return value;
}

export function diffKVP(
  prevIn: KVP,
  nextIn: KVP,
  add: (key: string, value: Value) => Value,
  remove: (key: string, value: Value) => void,
  update: (key: string, value: Value) => Value
): KVP {
  const prev = prevIn || {};
  const next = nextIn || {};
  const allKeys: string[] = Object.keys(prev).concat(Object.keys(next));
  const checked: { [key: string]: boolean } = {};

  return allKeys.reduce((newKVP, key) => {
    if (checked[key]) {
      return newKVP;
    }

    checked[key] = true;

    if (prev[key] === undefined && next[key] !== undefined) {
      newKVP[key] = add(key, next[key]);
    } else if (prev[key] !== undefined && next[key] === undefined) {
      remove(key, prev[key]);
    } else {
      newKVP[key] = update(key, next[key]);
    }

    return newKVP;
  }, {});
}

export function diffArray(
  prevIn: Value[],
  nextIn: Value[],
  add: (value: Value) => Value,
  remove: (value: Value) => void,
  update: (value: Value) => Value
): Value[] {
  const prev = prevIn || [];
  const next = nextIn || [];
  const allValues: Value[] = prev.concat(next);
  const checked: { [key: string]: boolean } = {};

  return allValues.reduce((newArray, value: any) => {
    if (checked[value]) {
      return newArray;
    }

    checked[value] = true;

    if (!prev.includes(value) && next.includes(value)) {
      newArray.push(add(value));
    } else if (prev.includes(value) && !next.includes(value)) {
      remove(value);
    } else {
      newArray.push(update(value));
    }

    return newArray;
  }, []);
}
