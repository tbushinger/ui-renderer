// Import stylesheets
import './style.css';
//import Renderer from './src/state/render';
//import { ElementState } from './src/state/types';
//import Style from './src/dom/style';
//import Text from './src/dom/text';
/*
const root = document.getElementById('app');
const model = {
  text: 'text 1',
};

const text = Text.create(root, () => false, (() => model.text) as any);
text.render();
model.text = 'text 2';
text.render();
*/
/*
const root = document.getElementById('app');
const model = {
  display: 'none',
};

const style = Style.create(root, 'display', (() => model.display) as any);
style.render();
model.display = null;
style.render();
*/

import Events from './src/dom/events';

const root = document.getElementById('app');
const events = Events.create(root);

const event = events.add('click', (e: any) => alert(e.target.id));

setTimeout(() => {
  events.dispose();
}, 5000);

/*
import CssClasses from './src/dom/cssClasses';

const root = document.getElementById('app');
const model = {
  value: 'container',
};

const classes = CssClasses.create(root);
const css = classes.add(() => model.value);
css.render();
model.value = null;
css.render();
*/

/*
import Attributes from './src/dom/attributes';

const root = document.getElementById('app');
const model = {
  value: 'Hello',
};

const attrs = Attributes.create(root);
const attr = attrs.add('title', () => model.value);
attrs.add('id', 'my id');
attrs.render();
model.value = null;
attr.render();
*/
/*
const meta: ElementState = {
  id: 'root',
  tagName: 'div',
  text: 'root',
  attributes: {
    title: 'Root element',
  },
  styles: {
    color: 'navy',
    backgroundColor: 'lightgray',
  },
  classes: ['container'],
  events: {
    click_1: {
      name: 'click',
      handler: () => console.log('Root Clicked'),
    },
  },
  children: {
    parent: {
      tagName: 'div',
      text: 'parent',
      attributes: {
        title: 'Parent element',
      },
      styles: {
        color: 'navy',
        backgroundColor: 'lightgray',
      },
      classes: ['container'],
      events: {
        click_1: {
          name: 'click',
          handler: (e) => {
            e.stopPropagation();
            console.log('Parent Clicked');
          },
        },
      },
    },
  },
};

const renderer = Renderer.create('app', meta);
let state = renderer.getState();

*/

// functions/binding
// events

/*
setTimeout(() => {
  root.dispose();
}, 5000);
*/
