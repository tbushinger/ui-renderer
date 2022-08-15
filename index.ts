import './style.css';
import Element from './src/dom/element';

const model = {
  text: 'hello',
};

const root = Element.create('app', 'div');
root.attributes().add('id', 'myId');
root.styles().add('color', 'navy');
root.classes().add('container');
root.events().add('click', (e) => console.log(e.target.id));
const child = root.addChild('div', () => model.text);
child.styles().add('margin', '10px');
child.classes().add('container');
child.attributes().add('id', 'mychild');
child.events().add('click', (e) => {
  e.stopPropagation();
  console.log(e.target.id);
});

root.render();

model.text = 'updated';

root.render();
/*
setTimeout(() => {
  root.dispose();
}, 5000);
*/
