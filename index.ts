// Import stylesheets
import './style.css';
import Element from './src/dom/element';

const root = Element.create('app', 'div', undefined);
root.setText('Root');
root.attributes().setIn('title', 'Root element');
root.styles().setIn('color', 'navy').setIn('backgroundColor', 'lightgrey');

root.classes().setIn('container');

const eventId = root.events().setIn('click', (e) => {
  console.log('event id', eventId);
  console.log('Click from root ID:', e.target.id);
});

const parent = root.addChild(
  'div',
  (p) => {
    p.setText('Parent');

    p.attributes().setIn('title', 'Parent Element');

    p.classes().setIn('container');

    p.events().setIn('click', (e) => {
      e.stopPropagation();
      console.log('Click from parent ID:', e.target.id);
    });

    p.addChild('div', (c) => {
      c.setText('Child');

      c.attributes().setIn('title', 'Child Element');

      c.classes().setIn('container');

      c.events().setIn('click', (e) => {
        e.stopPropagation();
        console.log('Click from Child ID:', e.target.id);
      });

      return c;
    });

    return p;
  },
  undefined
);

root.render();

/*
setTimeout(() => {
  root.dispose();
}, 5000);
*/
