// Import stylesheets
import './style.css';

let idCounter = 0;
function getId() {
  idCounter++;
  return idCounter;
}

function UIForm(targetId: string, meta: any): any {
  const target: HTMLElement = document.getElementById(targetId);

  if (!target) {
    throw new Error(`Target element ${targetId} not found!`);
  }

  return {
    render: () => {
      const eventHandlers: any = {};
      const {
        type,
        text,
        style,
        classes,
        attributes,
        events,
        id = getId(),
      } = meta;

      if (!type) {
        throw new Error(`Type is required!`);
      }

      const newElement: HTMLElement = document.createElement(type);

      newElement.setAttribute('id', id);

      if (text && text !== '') {
        newElement.innerText = text;
      }

      if (style) {
        Object.keys(style).forEach((key) => {
          newElement.style[key] = style[key];
        });
      }

      if (classes && classes.length) {
        classes.forEach((klass) => {
          newElement.classList.add(klass);
        });
      }

      if (attributes) {
        Object.keys(attributes).forEach((key) => {
          newElement.setAttribute(key, attributes[key]);
        });
      }

      if (events) {
        Object.keys(events).forEach((key) => {
          newElement.addEventListener(key, events[key]);
          eventHandlers[key] = events[key];
        });
      }

      // children

      target.appendChild(newElement);

      // destroy
      return () => {
        Object.keys(eventHandlers).forEach((key) => {
          newElement.removeEventListener(key, eventHandlers[key]);
          delete eventHandlers[key];
        });
      };
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
    title: 'Hello Tooltip!',
  },
  events: {
    click: (e) => alert(e.target.id),
  },
};

const form = UIForm('app', meta);

form.render();

// children
// event tokens
// refactor
