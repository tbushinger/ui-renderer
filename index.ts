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
  // children
};

const state = Renderer.create('app', meta);

// functions/binding
// events

/*
setTimeout(() => {
  root.dispose();
}, 5000);
*/
