// Import stylesheets
import './style.css';
import Renderer from './src/state/render';
import { ElementState } from './src/state/types';

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

/*
state.children.child1 = {
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
};
*/

renderer.update();

// functions/binding
// events

/*
setTimeout(() => {
  root.dispose();
}, 5000);
*/
