export interface Dictionary<T> {
  add: (key: string, value: any) => any;
  update: (key: string, item: T) => any;
  remove: (key: string) => any;
  has: (key: string) => boolean;
  item: (key: string) => T | null;
  forEach: (callback: (key: string, item: T) => void) => void;
}
