import { isNil } from './common';

export default function areEqual(value1: any, value2: any): boolean {
  if (isNil(value1) && isNil(value2)) {
    return true;
  }

  if (!isNil(value1) && isNil(value2)) {
    return false;
  }

  if (isNil(value1) && !isNil(value2)) {
    return false;
  }

  return value1 === value2;
}
