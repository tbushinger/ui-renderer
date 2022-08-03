// Import stylesheets
import './style.css';
//import Renderer from './src/state/render';
//import { ElementState } from './src/state/types';
import CssClass from './src/dom/cssClass';

const root = document.getElementById('app');
const model = {
  value: 'container',
};

const css = CssClass.create(root, (() => model.value) as any);
css.render().render().render();
model.value = null;
css.render().render();

/*
import Attribte from './src/dom/attribute';

const root = document.getElementById('app');
const model = {
  value: 'Hello',
};

const attr = Attribte.create(root, 'title', () => model.value);
attr.render().render().render();
//model.value = null;
//attr.render();
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
