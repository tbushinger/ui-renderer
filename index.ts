// Import stylesheets
import './style.css';

type FormMeta = any;
type FormState = any;

function shouldUpdateValue(prev: any, current: any): boolean {
  if (prev === undefined) {
    return true;
  }

  if (current === undefined) {
    return false;
  }

  if (prev === null && current !== null) {
    return true;
  }

  if (prev !== null && current === null) {
    return true;
  }

  return prev !== current;
}

function syncObjects(
  prevIn: any,
  currentIn: any,
  onDelete: (key: string, value: any) => void,
  onSet: (key: string, value: any, action: 'add' | 'update') => void,
  onCompare: (prev: any, current: any) => boolean = shouldUpdateValue
): any {
  const prev = prevIn || {};
  const current = currentIn || {};

  const keysToDelete = Object.keys(prev).filter(
    (key) => current[key] === undefined
  );
  const keysToAdd = Object.keys(current).filter(
    (key) => prev[key] === undefined
  );
  const keysToUpdate = Object.keys(current).filter(
    (key) => prev[key] !== undefined
  );

  keysToDelete.forEach((key) => onDelete(key, prev[key]));
  keysToAdd.forEach((key) => onSet(key, current[key], 'add'));
  keysToUpdate.forEach((key) => {
    const prevValue: any = prev[key];
    const currentValue: any = current[key];
    if (onCompare(prevValue, currentValue)) {
      onSet(key, currentValue, 'update');
    }
  });

  return current;
}

function ArrayToMap<T>(
  arrayIn: T[],
  onGetKey: (item: T, index: number) => string
): { [key: string]: T } {
  return arrayIn.reduce((acc, item, idx) => {
    const key = onGetKey(item, idx);
    acc[key] = item;
    return acc;
  }, {} as { [key: string]: T });
}

function syncArrays<T>(
  prevIn: T[] | undefined,
  currentIn: T[] | undefined,
  onGetKey: (item: T, index: number) => string,
  onDelete: (key: string, value: any) => void,
  onSet: (key: string, value: any, action: 'add' | 'update') => void,
  onCompare: (prev: any, current: any) => boolean = shouldUpdateValue
): T[] {
  const prev: T[] = prevIn || [];
  const current: T[] = currentIn || [];

  const prevMap: any = ArrayToMap<T>(prev, onGetKey);
  const currentMap: any = ArrayToMap<T>(current, onGetKey);

  const obj = syncObjects(prevMap, currentMap, onDelete, onSet, onCompare);

  return Object.values(obj);
}

function getTarget(targetId: string | HTMLElement): HTMLElement {
  let target: HTMLElement;
  if (typeof targetId === 'string') {
    target = document.getElementById(targetId);

    if (!target) {
      throw new Error(`Target element ${targetId} not found!`);
    }

    return target;
  }

  return targetId;
}

function setElement(
  target: HTMLElement,
  meta: FormMeta,
  onElement: (Element: HTMLElement) => void
): HTMLElement {
  const { type, id } = meta;

  if (!id) {
    throw new Error(`Id is required!`);
  }

  let element: HTMLElement = document.getElementById(id);
  if (!element) {
    if (!type) {
      throw new Error(`Type is required!`);
    }

    element = document.createElement(type);
    element.setAttribute('id', id);
  }

  onElement(element);

  target.appendChild(element);

  return element;
}

function setText(prev: any, current: any, element: HTMLElement): any {
  if (shouldUpdateValue(prev, current)) {
    element.innerText = current;
  }

  return current;
}

function setStyle(prev: any, current: any, element: HTMLElement): any {
  return syncObjects(
    prev,
    current,
    (key) => {
      element.style.removeProperty(key);
    },
    (key, prop) => {
      element.style[key] = prop;
    }
  );
}

function setClasses(prev: any, current: any, element: HTMLElement): any {
  return syncArrays<string>(
    prev,
    current,
    (klass) => klass,
    (klass) => element.classList.remove(klass),
    (klass, _value, action) => {
      if (action === 'add') {
        element.classList.add(klass);
      }
    }
  );
}

function setAttributes(prev: any, current: any, element: HTMLElement): any {
  return syncObjects(
    prev,
    current,
    (key) => {
      element.removeAttribute(key);
    },
    (key, prop) => {
      element.setAttribute(key, prop);
    }
  );
}

function setEvents(prev: any, current: any, element: HTMLElement): any {
  return syncObjects(
    prev,
    current,
    (event, handler) => {
      element.removeEventListener(event, handler);
    },
    (event, handler, action) => {
      if (action === 'add') {
        element.addEventListener(event, handler);
      }
    }
  );
}

function setChildren(prev: any, current: any, element: HTMLElement): any {
  return syncArrays<FormMeta | FormState>(
    prev,
    current,
    (c) => c.id,
    (_key: string, child: any) => {
      if (child.dispose) {
        child.dispose();
      }
    },
    (_key: string, child: any) => {
      const childState = child.getState ? child.getState() : child;
      return RenderForm(element, childState);
    }
  );
}

function RenderForm(targetId: string | HTMLElement, meta: FormMeta): any {
  const target = getTarget(targetId);

  let state: FormState = {};
  const { text, style, classes, attributes, events, children = [] } = meta;

  const element = setElement(target, meta, (e) => {
    state.element = e;
    state.id = e.getAttribute('id');
    state.text = setText(state.text, text, e);
    state.style = setStyle(state.style, style, e);
    state.classes = setClasses(state.classes, classes, e);
    state.attributes = setAttributes(state.attributes, attributes, e);
    state.events = setEvents(state.events, events, e);
    state.children = setChildren(state.children, children, e);
  });

  return {
    getState: () => {
      return state;
    },
    dispose: () => {
      setEvents(state.events, [], element);
      setChildren(state.children, [], element);
      state = {};
    },
  };
}

const meta: any = {
  id: 'myDiv',
  type: 'div',
  text: 'Hello',
  style: {
    backgroundColor: 'lightgray',
  },
  classes: ['container'],
  attributes: {
    title: 'Hello Tooltip',
  },
  events: {
    click: (e) => alert('parent'),
  },
  children: [
    {
      id: 'myDiv',
      type: 'div',
      text: 'hello from child',
      classes: ['container'],
      events: {
        click: (e) => {
          e.stopPropagation();
          alert('hello from child');
        },
      },
      children: [
        {
          id: 'myDiv2',
          type: 'div',
          text: 'hello from child 2',
          classes: ['container'],
          events: {
            click: (e) => {
              e.stopPropagation();
              alert('hello from child 2');
            },
          },
        },
      ],
    },
  ],
};

const form = RenderForm('app', meta);

setTimeout(() => {
  form.dispose();
}, 5000);

//const prevState = form.getState();
//const form2 = RenderForm(prevState.element, prevState);

//console.log(form2.getState());

// children state
// event tokens
// bindings
// arrays
